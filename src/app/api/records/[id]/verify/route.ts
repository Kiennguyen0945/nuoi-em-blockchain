import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRecordCommitment } from "@/lib/crypto";
import { publicClient, readRecordCommitmentOnChain } from "@/lib/viem";

type RouteContext = { params: { id: string } };

/** Tính lại commitment từ dữ liệu hiện tại và đối chiếu với blockchain. */
export async function GET(_req: Request, { params }: RouteContext) {
  const record = await prisma.record.findUnique({ where: { id: params.id } });
  if (!record) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }
  if (!record.commitment || !record.commitmentSalt) {
    return NextResponse.json(
      { error: "Hồ sơ chưa có commitment để kiểm chứng" },
      { status: 409 },
    );
  }

  try {
    const recomputed = createRecordCommitment(
      {
        id: record.id,
        schoolId: record.schoolId,
        localAuthId: record.localAuthId,
        goalLimit: record.goalLimit.toString(),
        bankAccountNumber: record.bankAccountNumber,
        situation: record.situation,
        childName: record.childName,
        childImage: record.childImage,
      },
      record.commitmentSalt,
    ).commitment;

    const onChain = await readRecordCommitmentOnChain(record.id);
    const databaseCommitmentMatches = record.commitment.toLowerCase() === recomputed.toLowerCase();
    const blockchainCommitmentMatches = onChain.commitment.toLowerCase() === recomputed.toLowerCase();

    let blockNumber: string | null = null;
    if (record.blockchainTxHash) {
      try {
        const receipt = await publicClient.getTransactionReceipt({
          hash: record.blockchainTxHash as `0x${string}`,
        });
        blockNumber = receipt.blockNumber.toString();
      } catch {
        blockNumber = null;
      }
    }

    return NextResponse.json({
      recordId: record.id,
      status: databaseCommitmentMatches && blockchainCommitmentMatches ? "VALID" : "MISMATCH",
      databaseCommitment: record.commitment,
      recomputedCommitment: recomputed,
      blockchainCommitment: onChain.commitment,
      databaseCommitmentMatches,
      blockchainCommitmentMatches,
      transactionHash: record.blockchainTxHash,
      blockNumber,
      blockchainTimestamp: onChain.timestamp.toString(),
      recordedBy: onChain.recordedBy,
      contractAddress: onChain.contractAddress,
    });
  } catch (error) {
    console.error("Blockchain verification error:", error);
    return NextResponse.json(
      { error: "Không thể đọc hoặc kiểm chứng dữ liệu trên blockchain" },
      { status: 502 },
    );
  }
}
