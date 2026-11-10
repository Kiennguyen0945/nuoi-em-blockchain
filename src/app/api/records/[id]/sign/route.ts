import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

type RouteContext = { params: { id: string } };

/**
 * POST /api/records/:id/sign
 * body: { action: "sign" | "reject", reason?: string }
 *
 * - SCHOOL: ký hồ sơ của trường mình (schoolId === user.id)
 * - LOCAL_AUTH: ký hồ sơ của xã mình (localAuthId === user.id)
 * - Chỉ khi hồ sơ ở PENDING_APPROVAL
 * - sign: sinh chữ ký sha256(privateKey + ":" + recordId), đủ 2 chữ ký → RECEIVING
 * - reject: bắt buộc reason, hồ sơ quay về DRAFT, xóa cả 2 chữ ký
 */
export async function POST(req: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (user.role !== "SCHOOL" && user.role !== "LOCAL_AUTH") {
    return NextResponse.json(
      { error: "Chỉ School và LocalAuth mới được ký/từ chối" },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const action = body?.action as "sign" | "reject" | undefined;
  if (action !== "sign" && action !== "reject") {
    return NextResponse.json(
      { error: "action phải là 'sign' hoặc 'reject'" },
      { status: 400 },
    );
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
  if (record.status !== "PENDING_APPROVAL") {
    return NextResponse.json(
      { error: "Chỉ ký/từ chối khi hồ sơ ở PENDING_APPROVAL" },
      { status: 409 },
    );
  }

  const isOwner =
    user.role === "SCHOOL"
      ? record.schoolId === user.id
      : record.localAuthId === user.id;
  if (!isOwner) {
    return NextResponse.json(
      { error: "Hồ sơ không thuộc phạm vi anh/chị" },
      { status: 403 },
    );
  }

  if (action === "reject") {
    const reason = body?.reason?.trim();
    if (!reason) {
      return NextResponse.json(
        { error: "Từ chối phải có lý do" },
        { status: 400 },
      );
    }
    const rejected = await prisma.record.update({
      where: { id: record.id },
      data: {
        status: "DRAFT",
        recordRejectedReason: reason,
        schoolSignature: null,
        localAuthSignature: null,
      },
      include: {
        school: { select: { organizationName: true, organizationCode: true } },
        localAuth: { select: { organizationName: true, organizationCode: true } },
      },
    });
    return NextResponse.json({ record: rejected });
  }

  // action === "sign"
  const signer = await prisma.user.findUnique({ where: { id: user.id } });
  if (!signer?.privateKey) {
    return NextResponse.json(
      { error: "Tài khoản chưa được cấp private key (MVP: lưu local DB)" },
      { status: 409 },
    );
  }
  const signature = createHash("sha256")
    .update(`${signer.privateKey}:${record.id}`)
    .digest("hex");

  const data =
    user.role === "SCHOOL"
      ? { schoolSignature: signature }
      : { localAuthSignature: signature };

  const updated = await prisma.record.update({
    where: { id: record.id },
    data,
    include: {
      school: { select: { organizationName: true, organizationCode: true } },
      localAuth: { select: { organizationName: true, organizationCode: true } },
    },
  });

  const bothSigned = updated.schoolSignature && updated.localAuthSignature;
  const finalRecord = bothSigned
    ? await prisma.record.update({
        where: { id: record.id },
        data: { status: "RECEIVING" },
        include: {
          school: { select: { organizationName: true, organizationCode: true } },
          localAuth: { select: { organizationName: true, organizationCode: true } },
        },
      })
    : updated;

  return NextResponse.json({ record: finalRecord, bothSigned: Boolean(bothSigned) });
}
