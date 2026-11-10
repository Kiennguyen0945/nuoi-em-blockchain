import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { canAccessRecord, redactL2 } from "@/lib/permissions";

type RouteContext = { params: { id: string } };

/**
 * GET /api/records/:id
 * Chi tiết 1 hồ sơ.
 * - 403 nếu hồ sơ không thuộc quyền xem của user (school khác trường / localAuth khác xã)
 * - L2 bị ẩn (childName = null) nếu Admin và status != DRAFT
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const record = await prisma.record.findUnique({
    where: { id: params.id },
  });
  if (!record) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }

  if (!canAccessRecord(user, record)) {
    return NextResponse.json(
      { error: "Bạn không có quyền xem hồ sơ này" },
      { status: 403 },
    );
  }

  return NextResponse.json({ record: redactL2(record, user) });
}
