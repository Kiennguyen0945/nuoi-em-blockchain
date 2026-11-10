import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canAccessRecord,
  canViewL2,
  redactL2,
  filterRecordsForUser,
  type SessionUser,
} from "../../src/lib/permissions";

const admin: SessionUser = { id: "admin-id", role: "ADMIN" };
const schoolA: SessionUser = { id: "school-a-id", role: "SCHOOL" };
const schoolB: SessionUser = { id: "school-b-id", role: "SCHOOL" };
const localAuthA: SessionUser = { id: "la-a-id", role: "LOCAL_AUTH" };
const localAuthB: SessionUser = { id: "la-b-id", role: "LOCAL_AUTH" };

const record = (
  status: string,
  schoolId: string | null = "school-a-id",
  localAuthId: string | null = "la-a-id",
) => ({
  id: "record-1",
  schoolId,
  localAuthId,
  status,
  childName: "Nguyễn Văn Bé",
  childImage: "child.jpg",
});

describe("Phân quyền xem - ADMIN", () => {
  it("Admin xem được mọi hồ sơ (L1)", () => {
    assert.equal(canAccessRecord(admin, record("DRAFT")), true);
    assert.equal(canAccessRecord(admin, record("PENDING_APPROVAL")), true);
    assert.equal(canAccessRecord(admin, record("RECEIVING")), true);
    assert.equal(canAccessRecord(admin, record("CLOSED")), true);
  });

  it("Admin thấy/nhập L2 khi hồ sơ ở DRAFT", () => {
    const r = record("DRAFT");
    assert.equal(canViewL2(admin, r), true);
    assert.equal(redactL2(r, admin).childName, "Nguyễn Văn Bé");
    assert.equal(redactL2(r, admin).childImage, "child.jpg");
    assert.equal(redactL2(r, admin).l2Redacted, false);
  });

  it("Admin KHÔNG xem được L2 từ PENDING_APPROVAL trở lên", () => {
    for (const status of [
      "PENDING_APPROVAL",
      "RECEIVING",
      "WAITING_FOR_REPORT",
      "CLOSED",
    ]) {
      const r = record(status);
      assert.equal(canViewL2(admin, r), false, `status=${status}`);
      const redacted = redactL2(r, admin);
      assert.equal(redacted.childName, null);
      assert.equal(redacted.childImage, null);
      assert.equal(redacted.l2Redacted, true);
    }
  });
});

describe("Phân quyền xem - SCHOOL", () => {
  it("School xem được hồ sơ của trường mình (mọi trạng thái)", () => {
    for (const status of [
      "DRAFT",
      "PENDING_APPROVAL",
      "RECEIVING",
      "WAITING_FOR_REPORT",
      "CLOSED",
    ]) {
      assert.equal(canAccessRecord(schoolA, record(status)), true);
      assert.equal(canViewL2(schoolA, record(status)), true);
    }
  });

  it("School KHÔNG xem được hồ sơ của trường khác", () => {
    assert.equal(canAccessRecord(schoolB, record("DRAFT")), false);
    assert.equal(canAccessRecord(schoolB, record("RECEIVING")), false);
    assert.equal(canViewL2(schoolB, record("DRAFT")), false);
    const redacted = redactL2(record("RECEIVING"), schoolB);
    assert.equal(redacted.childName, null);
  });

  it("School KHÔNG xem được L2 trẻ trường khác ngay cả khi chỉ cần metadata", () => {
    const r = record("PENDING_APPROVAL", "school-a-id", "la-a-id");
    assert.equal(canAccessRecord(schoolB, r), false);
    assert.equal(canViewL2(schoolB, r), false);
  });
});

describe("Phân quyền xem - LOCAL_AUTH", () => {
  it("LocalAuth xem được hồ sơ của khu vực mình", () => {
    for (const status of [
      "DRAFT",
      "PENDING_APPROVAL",
      "RECEIVING",
      "WAITING_FOR_REPORT",
      "CLOSED",
    ]) {
      assert.equal(canAccessRecord(localAuthA, record(status)), true);
      assert.equal(canViewL2(localAuthA, record(status)), true);
    }
  });

  it("LocalAuth KHÔNG xem được hồ sơ của khu vực khác", () => {
    assert.equal(canAccessRecord(localAuthB, record("DRAFT")), false);
    assert.equal(canAccessRecord(localAuthB, record("RECEIVING")), false);
    assert.equal(canViewL2(localAuthB, record("DRAFT")), false);
  });
});

describe("filterRecordsForUser", () => {
  const records = [
    { ...record("DRAFT", "school-a-id", "la-a-id"), id: "r-a" },
    { ...record("RECEIVING", "school-b-id", "la-b-id"), id: "r-b" },
    { ...record("PENDING_APPROVAL", "school-a-id", "la-a-id"), id: "r-c" },
  ];

  it("Admin thấy tất cả, L2 bị ẩn khi không phải DRAFT", () => {
    const visible = filterRecordsForUser(records, admin);
    assert.equal(visible.length, 3);
    const draft = visible.find((r) => r.id === "r-a");
    const approval = visible.find((r) => r.id === "r-c");
    assert.equal(draft?.l2Redacted, false);
    assert.equal(approval?.l2Redacted, true);
    assert.equal(approval?.childName, null);
  });

  it("School chỉ thấy hồ sơ của trường mình", () => {
    const visible = filterRecordsForUser(records, schoolA);
    assert.deepEqual(
      visible.map((r) => r.id).sort(),
      ["r-a", "r-c"],
    );
  });

  it("LocalAuth chỉ thấy hồ sơ của khu vực mình", () => {
    const visible = filterRecordsForUser(records, localAuthA);
    assert.deepEqual(
      visible.map((r) => r.id).sort(),
      ["r-a", "r-c"],
    );
    const visibleB = filterRecordsForUser(records, localAuthB);
    assert.deepEqual(visibleB.map((r) => r.id), ["r-b"]);
  });

  it("User không hợp lệ (thiếu id/role) không thấy gì", () => {
    const visible = filterRecordsForUser(records, {
      id: "",
      role: "SCHOOL",
    } as SessionUser);
    assert.equal(visible.length, 0);
  });
});
