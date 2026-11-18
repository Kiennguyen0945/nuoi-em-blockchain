import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const transactionId = new URL(req.url).searchParams.get("transactionId")?.trim();

  if (!transactionId || transactionId.length > 200) {
    return NextResponse.json(
      { found: false, error: "transactionId không hợp lệ" },
      { status: 400 },
    );
  }

  const donation = await prisma.donation.findUnique({
    where: { transactionId },
    select: {
      transactionId: true,
      amount: true,
      transactionHash: true,
      referenceCode: true,
      createdAt: true,
      recordId: true,
    },
  });

  if (!donation) {
    return NextResponse.json(
      { found: false, note: "Chưa tìm thấy giao dịch" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    found: true,
    status: "CONFIRMED",
    transactionId: donation.transactionId,
    amount: donation.amount.toString(),
    transactionHash: donation.transactionHash,
    referenceCode: donation.referenceCode,
    createdAt: donation.createdAt.toISOString(),
    recordId: donation.recordId,
  });
}
