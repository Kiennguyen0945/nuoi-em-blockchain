import { createRecordCommitment } from "@/lib/crypto";
import { getRecordCommitmentOnChain } from "@/lib/viem";

export type IntegrityCheckStatus = "VALID" | "FAILED" | "UNKNOWN";

export type RecordIntegrityInput = {
  id: string;
  schoolId: string | null;
  localAuthId: string | null;
  goalLimit: string | number;
  bankAccountNumber: string | null;
  situation: string | null;
  childName: string | null;
  childImage: string | null;
  commitment: string | null;
  commitmentSalt: string | null;
};

export type IntegrityCheckResult = {
  status: IntegrityCheckStatus;
  reason?: string;
};

const ZERO_COMMITMENT = `0x${"0".repeat(64)}`;

/**
 * Kiểm tra dữ liệu record hiện tại có khớp với commitment trên blockchain.
 * Hàm này chỉ đọc database/input và blockchain; không ghi transaction.
 */
export async function checkRecordIntegrity(
  record: RecordIntegrityInput,
): Promise<IntegrityCheckResult> {
  if (!record.commitment || !record.commitmentSalt) {
    return {
      status: "UNKNOWN",
      reason: "Hồ sơ chưa có commitment hoặc commitment salt",
    };
  }

  try {
    const localCommitment = createRecordCommitment(
      {
        id: record.id,
        schoolId: record.schoolId,
        localAuthId: record.localAuthId,
        goalLimit: record.goalLimit,
        bankAccountNumber: record.bankAccountNumber,
        situation: record.situation,
        childName: record.childName,
        childImage: record.childImage,
      },
      record.commitmentSalt,
    ).commitment;

    const onchain = await getRecordCommitmentOnChain(record.id);
    if (onchain.timestamp === 0n || onchain.commitment === ZERO_COMMITMENT) {
      return {
        status: "UNKNOWN",
        reason: "Chưa tìm thấy commitment trên blockchain",
      };
    }

    if (localCommitment.toLowerCase() !== onchain.commitment.toLowerCase()) {
      return {
        status: "FAILED",
        reason: "Dữ liệu hồ sơ không khớp với commitment trên blockchain",
      };
    }

    return { status: "VALID" };
  } catch (error) {
    return {
      status: "UNKNOWN",
      reason: error instanceof Error ? error.message : "Không thể đọc blockchain",
    };
  }
}
