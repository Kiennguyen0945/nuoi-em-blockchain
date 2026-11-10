import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

/**
 * GET /api/orgs  (chỉ ADMIN)
 * Danh sách tổ chức (SCHOOL / LOCAL_AUTH) để Admin chọn khi nhập hồ sơ.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ Admin được xem danh sách tổ chức" }, { status: 403 });
  }

  const orgs = await prisma.user.findMany({
    where: { role: { in: ["SCHOOL", "LOCAL_AUTH"] }, isActive: true },
    select: {
      id: true,
      role: true,
      fullName: true,
      organizationName: true,
      organizationCode: true,
    },
    orderBy: [{ role: "asc" }, { organizationCode: "asc" }],
  });

  return NextResponse.json({ orgs });
}
