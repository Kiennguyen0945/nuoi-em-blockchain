import { prisma } from "@/lib/prisma";
import {
  checkRecordIntegrity,
  type IntegrityCheckResult,
} from "@/lib/integrity";

/**
 * Kiểm tra và lưu trạng thái integrity của hồ sơ.
 * UNKNOWN không tự động mở quyên góp: giữ nguyên donationSuspended hiện tại.
 */
export async function verifyAndUpdateRecordIntegrity(
  recordId: string,
): Promise<IntegrityCheckResult> {
  const record = await prisma.record.findUnique({
    where: { id: recordId },
    select: {
      id: true,
      schoolId: true,
      localAuthId: true,
      goalLimit: true,
      bankAccountNumber: true,
      situation: true,
      childName: true,
      childImage: true,
      commitment: true,
      commitmentSalt: true,
      donationSuspended: true,
    },
  });

  if (!record) {
    throw new Error("Không tìm thấy hồ sơ");
  }

  const result = await checkRecordIntegrity({
    ...record,
    goalLimit: record.goalLimit.toString(),
  });

  await prisma.record.update({
    where: { id: record.id },
    data: {
      integrityStatus: result.status,
      integrityCheckedAt: new Date(),
      integrityFailureReason: result.reason ?? null,
      ...(result.status === "VALID"
        ? { donationSuspended: false }
        : result.status === "FAILED"
          ? { donationSuspended: true }
          : { donationSuspended: record.donationSuspended }),
    },
  });

  return result;
}
