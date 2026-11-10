import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { filterRecordsForUser } from "@/lib/permissions";

/**
 * GET /api/records
 * Danh sách hồ sơ theo quyền của người đăng nhập:
 * - ADMIN: toàn bộ hồ sơ (L2 chỉ khi DRAFT)
 * - SCHOOL: hồ sơ của trường mình
 * - LOCAL_AUTH: hồ sơ thuộc khu vực (xã) mình
 * L2 (childName, childImage) bị ẩn nếu không đủ quyền.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const records = await prisma.record.findMany({
    orderBy: { createdAt: "desc" },
  });

  const visible = filterRecordsForUser(records, user);
  return NextResponse.json({ records: visible });
}
