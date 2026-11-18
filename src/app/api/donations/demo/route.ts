import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDonationCommitment } from "@/lib/crypto";
import { recordCommitmentOnChain } from "@/lib/viem";

/**
 * Tạo một donation demo thật: lưu PostgreSQL và ghi commitment lên blockchain.
 * Chỉ mở trong development hoặc khi ALLOW_DEMO_DONATION=true.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_DONATION !== "true") {
    return NextResponse.json({ error: "Tính năng demo đã bị tắt" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const recordId = typeof body?.recordId === "string" ? body.recordId.trim() : "";
  const referenceCode = typeof body?.referenceCode === "string" ? body.referenceCode.trim() : "";
  const amount = Number(body?.amount);

  if (!recordId || !referenceCode || !Number.isInteger(amount) || amount < 1_000) {
    return NextResponse.json({ error: "Thông tin giao dịch demo không hợp lệ" }, { status: 400 });
  }

  const record = await prisma.record.findUnique({ where: { id: recordId } });
  if (!record) return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  if (record.status !== "RECEIVING") {
    return NextResponse.json({ error: "Hồ sơ chưa ở trạng thái nhận quyên góp" }, { status: 409 });
  }

  const existing = await prisma.donation.findFirst({
    where: { recordId, referenceCode },
    select: { id: true, amount: true, transactionId: true, blockchainTxHash: true },
  });
  if (existing?.blockchainTxHash) {
    return NextResponse.json({
      success: true,
      donation: {
        id: existing.id,
        amount: Number(existing.amount),
        transactionId: existing.transactionId,
        referenceCode,
        blockchainTxHash: existing.blockchainTxHash,
      },
    });
  }
  if (existing) {
    return NextResponse.json({ error: "Giao dịch demo đang được xử lý" }, { status: 409 });
  }

  const transactionId = `DEMO-${referenceCode}-${Date.now()}`;
  const created = await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: { recordId, amount, transactionId, referenceCode },
    });
    const commitment = createDonationCommitment({
      donationId: donation.id,
      recordId: donation.recordId,
      amount: donation.amount.toString(),
      transactionId: donation.transactionId,
      createdAt: donation.createdAt,
    }).commitment;
    const updatedDonation = await tx.donation.update({
      where: { id: donation.id },
      data: { commitment, transactionHash: commitment, onchainStatus: "ONCHAIN_SUBMITTED", retryCount: 1 },
    });
    return updatedDonation;
  });

  try {
    const blockchain = await recordCommitmentOnChain(
      created.id,
      created.commitment as `0x${string}`,
    );
    const confirmed = await prisma.donation.update({
      where: { id: created.id },
      data: {
        onchainStatus: "ONCHAIN_CONFIRMED",
        blockchainTxHash: blockchain.hash,
        onchainRecordedAt: new Date(),
        onchainError: null,
      },
    });

    return NextResponse.json({
      success: true,
      donation: {
        id: confirmed.id,
        amount: Number(confirmed.amount),
        transactionId: confirmed.transactionId,
        referenceCode: confirmed.referenceCode,
        blockchainTxHash: confirmed.blockchainTxHash,
      },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không ghi được blockchain";
    await prisma.donation.update({
      where: { id: created.id },
      data: { onchainStatus: "ONCHAIN_FAILED", onchainError: message },
    });
    return NextResponse.json({ error: "Lưu giao dịch được nhưng ghi blockchain thất bại", detail: message }, { status: 502 });
  }
}
