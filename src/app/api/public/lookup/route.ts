import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  recordMatchesQuery,
  type LookupRecord,
} from "@/lib/public-lookup";
import { sumDonationsForRecord } from "@/lib/public";

/**
 * GET /api/public/lookup?q=HS693DF
 * Tra cứu hồ sơ công khai theo mã hồ sơ (hoặc từ khóa hoàn cảnh).
 * Chỉ trả L1 + tình trạng — KHÔNG trả L2.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ records: [], query: q });
  }

  let rawRecords;
  try {
    rawRecords = await prisma.record.findMany({
      where: { status: { in: ["RECEIVING", "WAITING_FOR_REPORT"] } },
      orderBy: { createdAt: "desc" },
      include: {
        school: {
          select: { organizationName: true, organizationCode: true },
        },
        localAuth: {
          select: { organizationName: true, organizationCode: true },
        },
        _count: { select: { donations: true } },
      },
    });
  } catch (e) {
    console.error("lookup DB error:", e);
    return NextResponse.json({ records: [], query: q }, { status: 200 });
  }

  const sums = await sumDonationsForRecord(rawRecords.map((r) => r.id));
  type LookupView = LookupRecord & { raised: number; donationCount: number };
  const records: LookupView[] = rawRecords
    .filter((r) => recordMatchesQuery(r, q))
    .map((r) => ({
      id: r.id,
      situation: r.situation,
      status: r.status,
      goalLimit: Number(r.goalLimit),
      bankAccountNumber: r.bankAccountNumber,
      school: r.school,
      localAuth: r.localAuth,
      raised: sums.get(r.id) ?? 0,
      donationCount: r._count.donations,
    }));

  return NextResponse.json({ records, query: q });
}
