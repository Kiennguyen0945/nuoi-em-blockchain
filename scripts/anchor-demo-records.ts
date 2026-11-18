import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
async function main() {
  // Import sau khi dotenv.config() để viem đọc đúng local RPC và contract address.
  const { createRecordCommitment } = await import("../src/lib/crypto");
  const { recordCommitmentOnChain } = await import("../src/lib/viem");

  const records = await prisma.record.findMany({
    where: {
      status: "RECEIVING",
      commitment: null,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      status: true,
      schoolId: true,
      localAuthId: true,
      goalLimit: true,
      bankAccountNumber: true,
      situation: true,
      childName: true,
      childImage: true,
      commitment: true,
    },
  });

  if (records.length === 0) {
    console.log("Không có hồ sơ RECEIVING nào chưa được anchor.");
    return;
  }

  console.log(`Tìm thấy ${records.length} hồ sơ cần anchor.`);

  for (const record of records) {
    const shortCode = record.id.slice(0, 8).toUpperCase();

    const commitment = createRecordCommitment({
      id: record.id,
      schoolId: record.schoolId,
      localAuthId: record.localAuthId,
      goalLimit: record.goalLimit.toString(),
      bankAccountNumber: record.bankAccountNumber,
      situation: record.situation,
      childName: record.childName,
      childImage: record.childImage,
    });

    try {
      const blockchain = await recordCommitmentOnChain(
        record.id,
        commitment.commitment,
      );

      await prisma.record.update({
        where: { id: record.id },
        data: {
          commitment: commitment.commitment,
          commitmentSalt: commitment.salt,
          commitmentAlgorithm: commitment.algorithm,
          blockchainTxHash: blockchain.hash,
        },
      });

      console.log(`[OK] #${shortCode} -> ${record.id}`);
      console.log(`     commitment: ${commitment.commitment}`);
      console.log(`     tx: ${blockchain.hash}`);
    } catch (error) {
      console.error(
        `[FAIL] #${shortCode}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}

main()
  .catch((error) => {
    console.error("Anchor demo lỗi:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
