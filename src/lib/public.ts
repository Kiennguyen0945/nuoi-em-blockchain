import { prisma } from "./prisma";

/** Tổng số tiền (VND) đã quyên góp vào các hồ sơ — mọi giao dịch ghi vào DB được coi là CONFIRMED ở MVP. */
export async function sumDonationsForRecord(recordIds: string[]) {
  const sums = await prisma.donation.groupBy({
    by: ["recordId"],
    _sum: { amount: true },
    where: { recordId: { in: recordIds } },
  });
  const map = new Map<string, number>();
  for (const row of sums) {
    map.set(row.recordId, Number(row._sum.amount ?? 0));
  }
  return map;
}

export async function getPublicHomeStats() {
  const [totalRecords, receiving, totalDonations, confirmedSum] =
    await Promise.all([
      prisma.record.count(),
      prisma.record.count({ where: { status: "RECEIVING" } }),
      prisma.donation.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
    ]);

  return {
    totalRecords,
    receiving,
    totalDonations,
    totalConfirmed: Number(confirmedSum._sum.amount ?? 0),
  };
}

export async function getPublicRecords() {
  const records = await prisma.record.findMany({
    where: { status: { in: ["RECEIVING", "WAITING_FOR_REPORT"] } },
    orderBy: { createdAt: "desc" },
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
      _count: { select: { donations: true } },
    },
  });
  const sums = await sumDonationsForRecord(records.map((r) => r.id));
  return records.map((r) => ({
    ...r,
    raised: sums.get(r.id) ?? 0,
  }));
}

export async function getPublicRecord(id: string) {
  const record = await prisma.record.findUnique({
    where: { id },
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
      donations: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!record) return null;
  const raised = record.donations.reduce(
    (acc, d) => acc + Number(d.amount),
    0,
  );
  return { ...record, raised };
}

/** Danh sách donation cho trang sao kê — KHÔNG kèm bất kỳ định danh người chuyển. */
export async function getDonations(recordId: string) {
  return prisma.donation.findMany({
    where: { recordId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      amount: true,
      transactionId: true,
      createdAt: true,
      transactionHash: true,
    },
  });
}

export function formatVND(n: number | string | { toString(): string }) {
  return Number(n.toString() || 0).toLocaleString("vi-VN") + " đ";
}

export function shortCode(id: string) {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}
