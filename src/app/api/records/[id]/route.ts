import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { canAccessRecord, redactL2 } from "@/lib/permissions";

type RouteContext = { params: { id: string } };

/**
 * GET /api/records/:id — chi tiết 1 hồ sơ (đã lọc theo quyền).
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const record = await prisma.record.findUnique({
    where: { id: params.id },
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
    },
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

/**
 * PATCH /api/records/:id  (chỉ ADMIN, hồ sơ phải ở DRAFT)
 * body: { childName?, situation?, goalLimit?, bankAccountNumber?, childImage?, schoolId?, localAuthId?, action?: "submit" }
 * action="submit": chuyển DRAFT -> PENDING_APPROVAL (Admin khóa hồ sơ).
 */
export async function PATCH(req: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ Admin được sửa hồ sơ" }, { status: 403 });
  }

  const existing = await prisma.record.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }
  if (existing.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Chỉ sửa được hồ sơ ở DRAFT" },
      { status: 409 },
    );
  }

  const body = await req.json().catch(() => null);

  if (body?.action === "submit") {
    const submitted = await prisma.record.update({
      where: { id: params.id },
      data: { status: "PENDING_APPROVAL" },
      include: {
        school: { select: { organizationName: true, organizationCode: true } },
        localAuth: { select: { organizationName: true, organizationCode: true } },
      },
    });
    return NextResponse.json({ record: submitted });
  }

  const data: Record<string, unknown> = {};
  if (typeof body?.childName === "string" && body.childName.trim()) data.childName = body.childName.trim();
  if (typeof body?.situation === "string") data.situation = body.situation.trim() || null;
  if (typeof body?.goalLimit === "number" && Number.isFinite(body.goalLimit) && body.goalLimit >= 0) data.goalLimit = body.goalLimit;
  if (typeof body?.bankAccountNumber === "string") data.bankAccountNumber = body.bankAccountNumber.trim() || null;
  if (typeof body?.childImage === "string") data.childImage = body.childImage.trim() || null;
  if (typeof body?.schoolId === "string") data.schoolId = body.schoolId || null;
  if (typeof body?.localAuthId === "string") data.localAuthId = body.localAuthId || null;

  const record = await prisma.record.update({
    where: { id: params.id },
    data,
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
    },
  });
  return NextResponse.json({ record });
}

/**
 * DELETE /api/records/:id  (chỉ ADMIN)
 */
export async function DELETE(_req: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Chỉ Admin được xóa hồ sơ" }, { status: 403 });
  }

  const existing = await prisma.record.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }

  await prisma.record.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
