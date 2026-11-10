/**
 * Seed dữ liệu MVP cho Task 2 ([CHORE] Tạo bảng + 5 tài khoản):
 * - 1 ADMIN, 2 SCHOOL, 2 LOCAL_AUTH (Quyền cơ bản theo docs/database.puml)
 * - 2 hồ sơ trẻ em (mỗi trường 1 trẻ) để chứng minh:
 *   + Trường A không thể xem thông tin trẻ của trường B
 *   + LocalAuth chỉ xem trẻ thuộc khu vực mình phụ trách
 *
 * Chạy: npm run db:seed
 * Mật khẩu chung cho 5 tài khoản demo: Password123!
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Password123!";
const DEMO_PRIVATE_KEY_SEED = (tag: string) =>
  randomBytes(32).toString("hex"); // private key cấp cho school / localAuth (MVP lưu local DB)

async function main() {
  console.log("Bắt đầu seed dữ liệu MVP...");

  // 1) Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@nuoi-em.vn" },
    update: {},
    create: {
      username: "admin",
      email: "admin@nuoi-em.vn",
      fullName: "Quản trị viên NuôiEm",
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "ADMIN",
      organizationName: "Hệ thống NuôiEm",
      organizationCode: "ADMIN",
      isActive: true,
    },
  });

  const schoolA = await prisma.user.upsert({
    where: { email: "truong1@nuoi-em.vn" },
    update: {},
    create: {
      username: "truong_a",
      email: "truong1@nuoi-em.vn",
      fullName: "Trường TH A (Xã A)",
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "SCHOOL",
      organizationName: "Trường Tiểu học Xã A",
      organizationCode: "THAXA01",
      privateKey: DEMO_PRIVATE_KEY_SEED("school-a"),
      isActive: true,
    },
  });

  const schoolB = await prisma.user.upsert({
    where: { email: "truong2@nuoi-em.vn" },
    update: {},
    create: {
      username: "truong_b",
      email: "truong2@nuoi-em.vn",
      fullName: "Trường TH B (Xã B)",
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "SCHOOL",
      organizationName: "Trường Tiểu học Xã B",
      organizationCode: "THBXA02",
      privateKey: DEMO_PRIVATE_KEY_SEED("school-b"),
      isActive: true,
    },
  });

  const localAuthA = await prisma.user.upsert({
    where: { email: "localauth_xa@nuoi-em.vn" },
    update: {},
    create: {
      username: "localauth_a",
      email: "localauth_xa@nuoi-em.vn",
      fullName: "UBND Xã A",
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "LOCAL_AUTH",
      organizationName: "UBND Xã A",
      organizationCode: "UBXAA01",
      privateKey: DEMO_PRIVATE_KEY_SEED("localauth-a"),
      isActive: true,
    },
  });

  const localAuthB = await prisma.user.upsert({
    where: { email: "localauth_xb@nuoi-em.vn" },
    update: {},
    create: {
      username: "localauth_b",
      email: "localauth_xb@nuoi-em.vn",
      fullName: "UBND Xã B",
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "LOCAL_AUTH",
      organizationName: "UBND Xã B",
      organizationCode: "UBXAB02",
      privateKey: DEMO_PRIVATE_KEY_SEED("localauth-b"),
      isActive: true,
    },
  });

  // 2) Xoá donations/records demo cũ cho sạch (nếu chạy seed lại)
  await prisma.donation.deleteMany({
    where: { record: { schoolId: { in: [schoolA.id, schoolB.id] } } },
  });
  await prisma.record.deleteMany({
    where: { schoolId: { in: [schoolA.id, schoolB.id] } },
  });

  // 3) Hồ sơ trẻ em: mỗi trường 1 trẻ, gắn đúng localAuth khu vực
  const recordA = await prisma.record.create({
    data: {
      schoolId: schoolA.id,
      localAuthId: localAuthA.id,
      createdBy: admin.id,
      goalLimit: 10_000_000,
      bankAccountNumber: "9704220000000001",
      situation:
        "Hoàn cảnh khó khăn: mồ côi mẹ, cha làm thuê, Xã A",
      status: "DRAFT",
      childName: "Bé Minh An (Trường A)",
    },
  });

  const recordB = await prisma.record.create({
    data: {
      schoolId: schoolB.id,
      localAuthId: localAuthB.id,
      createdBy: admin.id,
      goalLimit: 8_000_000,
      bankAccountNumber: "9704220000000002",
      situation:
        "Hoàn cảnh khó khăn: cả cha mẹ đi vắng, ở với bà (Xã B)",
      status: "PENDING_APPROVAL",
      childName: "Bé Gia Huy (Trường B)",
    },
  });

  // 4) In kết quả kiểm chứng
  console.log("Seed hoàn tất ✅");
  console.log("Mật khẩu chung 5 tài khoản:", DEMO_PASSWORD);
  console.table([
    { role: "ADMIN", email: admin.email, user: admin.username },
    { role: "SCHOOL", email: schoolA.email, user: schoolA.username },
    { role: "SCHOOL", email: schoolB.email, user: schoolB.username },
    { role: "LOCAL_AUTH", email: localAuthA.email, user: localAuthA.username },
    { role: "LOCAL_AUTH", email: localAuthB.email, user: localAuthB.username },
  ]);
  console.log("\nHồ sơ mẫu:");
  console.table([
    { record: "A", school: schoolA.organizationCode, localAuth: localAuthA.organizationCode, child: recordA.childName, status: recordA.status },
    { record: "B", school: schoolB.organizationCode, localAuth: localAuthB.organizationCode, child: recordB.childName, status: recordB.status },
  ]);
}

main()
  .catch((e) => {
    console.error("Seed thất bại:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
