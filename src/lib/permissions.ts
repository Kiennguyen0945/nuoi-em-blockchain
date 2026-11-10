/**
 * Cơ chế phân quyền xem cho 3 vai trò: ADMIN, SCHOOL, LOCAL_AUTH.
 *
 * Quy tắc nghiệp vụ (theo docs/Questions.md + docs/PhanCong.md + task [FEAT]):
 *
 * 1. Admin: xem và nhập L2 khi hồ sơ ở trạng thái DRAFT.
 *    Admin KHÔNG được xem L2 từ PENDING_APPROVAL trở lên.
 * 2. School: CHỈ xem được trẻ em của trường mình (record.schoolId === user.id),
 *    kể cả L2 — trường cần xem thường xuyên không cần one-time link.
 * 3. LocalAuth: CHỈ xem được trẻ em thuộc khu vực mình (record.localAuthId === user.id),
 *    kể cả L2 (cơ quan chức năng xác minh trực tiếp).
 * 4. Ai cũng truy cập được metadata L1 của hồ sơ mà mình có quyền xem (Admin: tất cả,
 *    School: trường mình, LocalAuth: xã/khu vực mình).
 *
 * L2 gồm: childName, childImage.
 * L1 gồm: mã hồ sơ, tên trường, tài khoản, tên xã, hoàn cảnh, status...
 *
 * Mọi hàm đều thuần (pure) để unit test dễ dàng.
 */

export type UserRole = "ADMIN" | "SCHOOL" | "LOCAL_AUTH";

export type SessionUser = {
  id: string;
  role: UserRole;
};

/** Cấu trúc tối thiểu của hồ sơ mà tầng phân quyền cần. */
export type RecordForPermission = {
  id: string;
  schoolId: string | null;
  localAuthId: string | null;
  status: string;
  childName?: string | null;
  childImage?: string | null;
};

/** Các trạng thái tại đó L2 của hồ sơ bị khóa với Admin. */
export const L2_LOCKED_STATUSES = new Set([
  "PENDING_APPROVAL",
  "RECEIVING",
  "WAITING_FOR_REPORT",
  "CLOSED",
]);

/**
 * Quyền truy cập hồ sơ (metadata L1).
 * - Admin: xem mọi hồ sơ.
 * - School: chỉ hồ sơ gắn trường mình.
 * - LocalAuth: chỉ hồ sơ gắn khu vực của mình.
 */
export function canAccessRecord(
  user: SessionUser,
  record: Pick<RecordForPermission, "schoolId" | "localAuthId">,
): boolean {
  if (!user?.id || !user.role) return false;
  switch (user.role) {
    case "ADMIN":
      return true;
    case "SCHOOL":
      return record.schoolId === user.id;
    case "LOCAL_AUTH":
      return record.localAuthId === user.id;
    default:
      return false;
  }
}

/**
 * Quyền xem L2 (childName, childImage).
 * - Admin: CHỈ khi hồ sơ đang ở DRAFT. Từ PENDING_APPROVAL trở đi không xem được.
 * - School: hồ sơ gắn trường mình.
 * - LocalAuth: hồ sơ gắn khu vực (xã) mình.
 */
export function canViewL2(
  user: SessionUser,
  record: Pick<RecordForPermission, "schoolId" | "localAuthId" | "status">,
): boolean {
  if (!canAccessRecord(user, record)) return false;
  if (user.role === "ADMIN") return record.status === "DRAFT";
  // School / LocalAuth: xem L2 của trẻ thuộc trường / khu vực của mình
  return true;
}

/**
 * Bỏ các trường L2 khỏi hồ sơ khi người xem không có quyền.
 * Trả về BẢN SAO, không sửa object gốc.
 */
export function redactL2<T extends RecordForPermission>(
  record: T,
  user: SessionUser,
): T & { l2Redacted: boolean } {
  if (canViewL2(user, record)) return { ...record, l2Redacted: false };
  return { ...record, childName: null, childImage: null, l2Redacted: true };
}

/**
 * Lọc danh sách hồ sơ: trả về các hồ sơ user được xem,
 * kèm L2 đã được che (nếu không đủ quyền).
 */
export function filterRecordsForUser<T extends RecordForPermission>(
  records: T[],
  user: SessionUser,
): (T & { l2Redacted: boolean })[] {
  return records
    .filter((r) => canAccessRecord(user, r))
    .map((r) => redactL2(r, user));
}

/** Mô tả quy tắc — dùng để hiển thị trong tài liệu/API docs. */
export const PERMISSION_RULES: Record<
  UserRole,
  { access: string; l2: string }
> = {
  ADMIN: {
    access: "Xem toàn bộ hồ sơ (L1)",
    l2: "Xem/nhập L2 khi hồ sơ DRAFT; ẩn L2 từ PENDING_APPROVAL trở lên",
  },
  SCHOOL: {
    access: "Chỉ xem hồ sơ của trường mình",
    l2: "Xem L2 của trẻ trường mình",
  },
  LOCAL_AUTH: {
    access: "Chỉ xem hồ sơ thuộc khu vực (xã) mình",
    l2: "Xem L2 của trẻ khu vực mình",
  },
};
