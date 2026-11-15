/**
 * Seed 21 hồ sơ demo = 7 em/trường × 3 trường (A, B, C).
 * - Tạo thêm Trường TH Xã C + UBND Xã C (màn hình sau cũng vậy)
 * - Xóa hồ sơ/donations demo cũ, tạo lại 21 hồ sơ mới
 * - Mỗi trường: 3 RECEIVING (kèm donations), 2 PENDING_APPROVAL, 2 DRAFT
 *
 * Chạy: npm run db:seed-demo
 * Mật khẩu chung 3 trưởng / 3 chính quyền: Password123!
 */
import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();
const PASSWORD = "Password123!";

function pid(tag: string) {
  return createHash("sha256")
    .update(tag + randomBytes(4).toString("hex"))
    .digest("hex");
}

async function upsertUser(data: {
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "SCHOOL" | "LOCAL_AUTH";
  organizationCode: string;
  organizationName: string;
  privateKey?: string;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: {
      ...data,
      passwordHash: hashPassword(PASSWORD),
      organizationCode: data.organizationCode,
      organizationName: data.organizationName,
      isActive: true,
    },
  });
}

const CHILDREN: Array<{
  school: "A" | "B" | "C";
  name: string;
  age: number;
  gender: "Nam" | "Nữ";
  situation: string;
  goal: number;
  status: "DRAFT" | "PENDING_APPROVAL" | "RECEIVING";
  giftRounds: number;
}> = [
  // ===== Trường TH Xã A =====
  { school: "A", name: "Giàng A Páo", age: 7, gender: "Nam", situation: "Mồ côi cả cha lẫn mẹ, ở với ông bà ngoại, Xã A", goal: 8_000_000, status: "RECEIVING", giftRounds: 4 },
  { school: "A", name: "Hừ A Mang", age: 9, gender: "Nam", situation: "Cha bị tai nạn lao động, mẹ đi làm thuê xa, Xã A", goal: 9_000_000, status: "RECEIVING", giftRounds: 5 },
  { school: "A", name: "Lù A Dê", age: 8, gender: "Nam", situation: "Hoàn cảnh khó khăn, cha mất sớm, Xã A", goal: 7_500_000, status: "RECEIVING", giftRounds: 3 },
  { school: "A", name: "Vàng Thị Dúa", age: 10, gender: "Nữ", situation: "Hộ nghèo, mẹ làm thuê, Xã A", goal: 8_500_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "A", name: "Sùng A Cháng", age: 6, gender: "Nam", situation: "Mồ côi mẹ, cha bị bệnh, Xã A", goal: 10_000_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "A", name: "Thào Thị Cường", age: 8, gender: "Nữ", situation: "Bố mẹ ly hôn, ở với bà nội, Xã A", goal: 6_000_000, status: "DRAFT", giftRounds: 0 },
  { school: "A", name: "Mùa A Hang", age: 9, gender: "Nam", situation: "Hộ cận nghèo, 4 anh em, Xã A", goal: 9_000_000, status: "DRAFT", giftRounds: 0 },

  // ===== Trường TH Xã B =====
  { school: "B", name: "Giàng Thị Mị", age: 8, gender: "Nữ", situation: "Cha mất, mẹ đi xuất khẩu lao động, Xã B", goal: 7_000_000, status: "RECEIVING", giftRounds: 4 },
  { school: "B", name: "Ly A Chùa", age: 10, gender: "Nam", situation: "Cả cha và mẹ đi vắng, ở với bà, Xã B", goal: 8_000_000, status: "RECEIVING", giftRounds: 6 },
  { school: "B", name: "Pằng Thị Hồng", age: 7, gender: "Nữ", situation: "Mồ côi cha mẹ, ở với cụ, Xã B", goal: 7_500_000, status: "RECEIVING", giftRounds: 3 },
  { school: "B", name: "Lo A Sam", age: 9, gender: "Nam", situation: "Bố mẹ làm nương rẫy, thu nhập thất thường, Xã B", goal: 8_500_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "B", name: "Vàng Văn Minh", age: 6, gender: "Nam", situation: "Hộ nghèo, bố mất việc, Xã B", goal: 6_500_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "B", name: "Chá Thị Ly", age: 8, gender: "Nữ", situation: "Gia đình đông con, bố mẹ làm thuê, Xã B", goal: 9_000_000, status: "DRAFT", giftRounds: 0 },
  { school: "B", name: "Doãn Văn Thanh", age: 7, gender: "Nam", situation: "Mồ côi cha, mẹ mang thai, Xã B", goal: 10_000_000, status: "DRAFT", giftRounds: 0 },

  // ===== Trường TH Xã C =====
  { school: "C", name: "Hờ A Vừ", age: 9, gender: "Nam", situation: "Bố ốm, mẹ làm thuê theo mùa, Xã C", goal: 9_500_000, status: "RECEIVING", giftRounds: 5 },
  { school: "C", name: "Sùng Văn Thiên", age: 8, gender: "Nam", situation: "Mồ côi cha, mẹ đi chợ bán hàng rong, Xã C", goal: 7_000_000, status: "RECEIVING", giftRounds: 4 },
  { school: "C", name: "Lò Thị Hoa", age: 10, gender: "Nữ", situation: "Hộ nghèo, bố đi làm ăn xa, Xã C", goal: 8_000_000, status: "RECEIVING", giftRounds: 3 },
  { school: "C", name: "Tế A Cao", age: 7, gender: "Nam", situation: "Bố mẹ ly hôn, ở với ông nội, Xã C", goal: 6_500_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "C", name: "Vừ Thị Dua", age: 8, gender: "Nữ", situation: "Hộ nghèo, mẹ đơn thân làm nương, Xã C", goal: 8_500_000, status: "PENDING_APPROVAL", giftRounds: 0 },
  { school: "C", name: "Giàng Văn Minh", age: 6, gender: "Nam", situation: "Gia đình đông con, bố mẹ làm thuê, Xã C", goal: 9_000_000, status: "DRAFT", giftRounds: 0 },
  { school: "C", name: "Vue Thị Tùng", age: 9, gender: "Nữ", situation: "Mồ côi mẹ, cha bị bệnh, Xã C", goal: 7_500_000, status: "DRAFT", giftRounds: 0 },
];

async function main() {
  console.log("Seed 21 hồ sơ demo...");

  // 1) 3 trường + 3 localAuth (upsert để chạy lại được)
  const admin = await upsertUser({
    username: "admin",
    email: "admin@nuoi-em.vn",
    fullName: "Quản trị viên NuôiEm",
    role: "ADMIN",
    organizationCode: "ADMIN",
    organizationName: "Hệ thống NuôiEm",
  });

  const schoolA = await upsertUser({
    username: "truong_a",
    email: "truong1@nuoi-em.vn",
    fullName: "Trường TH Xã A",
    role: "SCHOOL",
    organizationCode: "THAXA01",
    organizationName: "Trường Tiểu học Xã A",
    privateKey: pid("school-a"),
  });
  const schoolB = await upsertUser({
    username: "truong_b",
    email: "truong2@nuoi-em.vn",
    fullName: "Trường TH Xã B",
    role: "SCHOOL",
    organizationCode: "THBXA02",
    organizationName: "Trường Tiểu học Xã B",
    privateKey: pid("school-b"),
  });
  const schoolC = await upsertUser({
    username: "truong_c",
    email: "truong3@nuoi-em.vn",
    fullName: "Trường TH Xã C",
    role: "SCHOOL",
    organizationCode: "THCXA03",
    organizationName: "Trường Tiểu học Xã C",
    privateKey: pid("school-c"),
  });

  const localAuthA = await upsertUser({
    username: "localauth_a",
    email: "localauth_xa@nuoi-em.vn",
    fullName: "UBND Xã A",
    role: "LOCAL_AUTH",
    organizationCode: "UBXAA01",
    organizationName: "UBND Xã A",
    privateKey: pid("localauth-a"),
  });
  const localAuthB = await upsertUser({
    username: "localauth_b",
    email: "localauth_xb@nuoi-em.vn",
    fullName: "UBND Xã B",
    role: "LOCAL_AUTH",
    organizationCode: "UBXAB02",
    organizationName: "UBND Xã B",
    privateKey: pid("localauth-b"),
  });
  const localAuthC = await upsertUser({
    username: "localauth_c",
    email: "localauth_xc@nuoi-em.vn",
    fullName: "UBND Xã C",
    role: "LOCAL_AUTH",
    organizationCode: "UBXAC03",
    organizationName: "UBND Xã C",
    privateKey: pid("localauth-c"),
  });

  const schoolByCode = { A: schoolA, B: schoolB, C: schoolC } as const;
  const laByCode = { A: localAuthA, B: localAuthB, C: localAuthC } as const;

  // 2) Xóa dữ liệu demo cũ (hồ sơ + donations) của 3 trường
  const schoolIds = [schoolA.id, schoolB.id, schoolC.id];
  await prisma.donation.deleteMany({
    where: { record: { schoolId: { in: schoolIds } } },
  });
  await prisma.record.deleteMany({
    where: { schoolId: { in: schoolIds } },
  });

  // 3) Tạo 21 hồ sơ
  let seq = 1;
  for (const child of CHILDREN) {
    const school = schoolByCode[child.school];
    const localAuth = laByCode[child.school];
    const bankAcc =
      "970422" + String(1000000000 + seq).slice(1);
    const record = await prisma.record.create({
      data: {
        schoolId: school.id,
        localAuthId: localAuth.id,
        createdBy: admin.id,
        goalLimit: child.goal,
        bankAccountNumber: bankAcc,
        situation: `${child.situation} · ${child.age} tuổi · ${child.gender}`,
        status: child.status,
        childName: `Em ${child.name}`,
        schoolSignature:
          child.status === "PENDING_APPROVAL" && seq % 5 === 0
            ? pid("sig-school-" + seq)
            : null,
        localAuthSignature:
          child.status === "PENDING_APPROVAL" && seq % 7 === 0
            ? pid("sig-la-" + seq)
            : null,
      },
    });

    // Donations cho hồ sơ RECEIVING: 40-60% mục tiêu, chia 3-6 lần
    if (child.status === "RECEIVING" && child.giftRounds > 0) {
      const target = Math.round(child.goal * (0.35 + Math.random() * 0.25));
      let remaining = target;
      for (let i = 0; i < child.giftRounds; i++) {
        const last = i === child.giftRounds - 1;
        const amount = last
          ? remaining
          : Math.round((target / child.giftRounds) * (0.6 + Math.random() * 0.8));
        remaining = Math.max(0, remaining - amount);
        const txId =
          "VIB" +
          new Date().getFullYear() +
          String(seq).padStart(2, "0") +
          String(i + 1).padStart(3, "0") +
          Math.random().toString(36).slice(2, 6).toUpperCase();
        await prisma.donation.create({
          data: {
            recordId: record.id,
            amount: Math.max(amount, 50_000),
            transactionId: txId,
            transactionHash:
              "0x" + pid("tx-" + seq + "-" + i).slice(0, 40),
            referenceCode: `HS${String(seq).padStart(2, "0")}${child.school}A${child.status === "RECEIVING" ? "R" : "X"}`,
            createdAt: new Date(
              Date.now() - (child.giftRounds - i) * 36e5 * 18, // rải giao dịch theo thời gian
            ),
          },
        });
      }
    }
    console.log(`  #${seq} ${child.school} | ${child.status.padEnd(17)} | ${child.name} | ${child.goal / 1_000_000}tr`);
    seq++;
  }

  // 4) Tổng kết
  const totalRecords = await prisma.record.count();
  const totalDonations = await prisma.donation.count();
  const receiving = await prisma.record.count({ where: { status: "RECEIVING" } });
  console.log(`\n✅ Hoàn tất: ${totalRecords} hồ sơ (${receiving} RECEIVING) · ${totalDonations} donations`);
  console.log("Mật khẩu 6 tài khoản + admin:", PASSWORD);
  console.log("Tài khoản mới: truong3@nuoi-em.vn (THCXA03) · localauth_xc@nuoi-em.vn (UBXAC03)");
}

main()
  .catch((e) => {
    console.error("Seed demo lỗi:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
