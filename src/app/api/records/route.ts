import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { filterRecordsForUser } from "@/lib/permissions";

/**
 * GET /api/records
 * Danh sách hồ sơ theo quyền của người đăng nhập.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const records = await prisma.record.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
    },
  });

  const visible = filterRecordsForUser(records, user);
  return NextResponse.json({ records: visible });
}

/**
 * POST /api/records  (chỉ ADMIN)
 * Tạo hồ sơ mới — Admin nhập L2 lúc này, hồ sơ ở trạng thái DRAFT.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Chỉ Admin được tạo hồ sơ" },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const childName = body?.childName?.trim();
  const goalLimit = Number(body?.goalLimit);
  const schoolId = body?.schoolId || null;
  const localAuthId = body?.localAuthId || null;
  const situation = body?.situation?.trim() || null;
  const bankAccountNumber = body?.bankAccountNumber?.trim() || null;
  const childImage = body?.childImage?.trim() || null;

  if (!childName) {
    return NextResponse.json({ error: "Tên trẻ không được trống" }, { status: 400 });
  }
  if (!Number.isFinite(goalLimit) || goalLimit < 0) {
    return NextResponse.json({ error: "Mục tiêu không hợp lệ" }, { status: 400 });
  }

  const record = await prisma.record.create({
    data: {
      childName,
      situation,
      goalLimit,
      bankAccountNumber,
      childImage,
      schoolId,
      localAuthId,
      createdBy: user.id,
      status: "DRAFT",
    },
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
    },
  });

  return NextResponse.json({ record }, { status: 201 });
}
