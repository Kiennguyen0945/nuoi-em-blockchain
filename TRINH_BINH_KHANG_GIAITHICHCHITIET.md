# GIẢI THÍCH CHI TIẾT — Task 2 ([CHORE] Tạo bảng + 5 tài khoản)

> Giải thích đối chiếu với code thật trong repo (nhánh `main`).

---

## 1. "Giữ `prisma/schema.prisma` đúng theo `docs/database.puml`; đồng bộ DB qua `db:push`"

### Ý nghĩa
`docs/database.puml` là **bản thiết kế database bằng UML** — nó mô tả 4 bảng:

```
Users      (
  id, username, role, organizationName, organizationCode,
  privateKey, passwordHash
)
Records    (
  id, schoolId, localAuthId, goalLimit, bankAccountNumber,
  schoolSignature, localAuthSignature, situation, status,
  reportStatus, reportRejectedReason, childName, childImage,
  createdAt, updatedAt
)
Donations  ( id, recordId, amount, transactionId, transactionHash, createdAt )
AuditLogs  ( id, actorId, entityType, action, fieldName, oldValue, newValue, reason )
```

File `prisma/schema.prisma` đã **được nhóm chủ repo viết sẵn** (không phải tự thiết kế bảng). Task của bạn: **đồng bộ** DB thực tế (đang chạy trong Docker) với thiết kế đó — không sửa schema, chỉ áp dụng nó.

### Lệnh
```powershell
npm run db:push
```

Lệnh này làm 3 việc (in ra terminal):
1. `prisma db push` đọc `prisma/schema.prisma` → tính ra SQL cần chạy → **tạo/cập nhật bảng trong Postgres** (không xóa data cũ)
2. Tự động chạy `prisma generate` → sinh ra **Prisma Client** (bộ hàm TypeScript để truy vấn DB, ví dụ `prisma.user.findMany()`)
3. Báo: *"Your database is now in sync with your Prisma schema."*

### Tại sao cần bước này
- Postgres trong Docker lúc đó **mới có DB rỗng** `charity_ledger` — chưa có bảng nào.
- Chưa đồng bộ thì `/api/records`, seed data, đăng nhập… **đều lỗi**.
- Chỉ chạy 1 lần. Lần chạy sau là "already in sync" (không thay đổi gì).

---

## 2. "Viết `src/lib/password.ts` (scrypt hash + timingSafeEqual — không cài thêm thư viện)"

### Vấn đề cần giải quyết
Bảng `users` có cột `password_hash` — không được phép **lưu mật khẩu dạng plaintext**. Bất kỳ ai đọc được DB (admin DB, backup rò rỉ) đọc lộn cả. Mật khẩu phải được **băm một chiều**.

### Tại sao scrypt, không phải SHA-256/bcrypt/argon2?

| Thuật toán | Vì sao (không) chọn |
|---|---|
| SHA-256 / MD5 | ❌ Quá nhanh → brute force dễ dàng |
| bcrypt | ✅ Tốt, nhưng cần cài thư viện + build native → CI tốn thời gian, dễ lệch phiên bản |
| **scrypt** | ✅ Có sẵn trong Node (`node:crypto`), **không cần cài thêm gì**, đủ chậm chống brute force |
| argon2 | ✅ Hiện đại nhất, nhưng native build như bcrypt — overkill cho MVP |

### Các hàm trong file `password.ts`

```ts
hashPassword(plain: string): string
// N=16384, r=8, p=1 — sinh salt ngẫu nhiên 16 byte
// salt: random bytes thêm vào mật khẩu để 2 người cùng pass vẫn ra hash khác nhau
//       -> chống rainbow table
// Kết quả: "scrypt$16384$8$1$<hex salt>$<hex key>"
// Format có cấu trúc giúp nâng cấp tham số về sau mà không mất tương thích
```

```ts
verifyPassword(plain: string, stored: string): boolean
// 1. Tách stored string thành scheme/N/r/p/salt/derivedKey
// 2. Tính lại key từ plain + salt + N/r/p
// 3. So sánh bằng timingSafeEqual
```

### `timingSafeEqual` hoạt động thế nào?
```ts
timingSafeEqual(actual, expected)
```
So sánh 2 buffer **tốn cùng thời gian dù sai ở byte nào** — trong khi phép `===` string thông thường chạy nhanh hơn nếu byte đầu sai. Hacker có thể đo tốc độ phản hồi để đoán từng ký tự (*timing attack*). `timingSafeEqual` loại bỏ toàn bộ kênh rò rỉ thời gian.

### Kết quả test (đã chạy)
```
valid: true      (Password123! → hash)
wrong: false     (sai mật khẩu → false)
```

---

## 3. "Viết `prisma/seed.ts` + lệnh `npm run db:seed`"

### Seed là gì?
*Seed* = nhồi dữ liệu mẫu vào DB sau khi đã tạo bảng. Lợi ích:
- Nhân viên mới clone về chạy 5 lệnh là có hệ thống thật ngay.
- Không phải thêm tay từng tài khoản qua `prisma studio` (tốn thời gian, dễ sai).
- Mọi máy cùng DB seed giống nhau → demo giống nhau.

### 5 tài khoản trong seed

```
1 ADMIN    : admin@nuoi-em.vn         organizationCode ADMIN
2 SCHOOL   : truong1@nuoi-em.vn       organizationCode THAXA01 (Trường TH Xã A)
             truong2@nuoi-em.vn       organizationCode THBXA02 (Trường TH Xã B)
2 LOCALAUTH: localauth_xa@nuoi-em.vn  organizationCode UBXAA01 (UBND Xã A)
             localauth_xb@nuoi-em.vn  organizationCode UBXAB02 (UBND Xã B)
```
Tất cả mật khẩu `Password123!` — được băm bằng `hashPassword` ở mục 2, **không lưu plaintext**.

### Cấu trúc role ↔ organizationCode
- **School** gắn `THAXA01/THBXA02` → hệ thống biết "tài khoản này thuộc trường A hay B".
- **LocalAuth** gắn `UBXAA01/UBXAB02` → biết "tài khoản này thuộc xã A hay B".
- **Trẻ em** (records) có cột `school_id` và `local_auth_id` → trỏ tới trường và UBND phụ trách.

→ Đây chính là nền tảng để phân quyền hoạt động (Task 3 sẽ biến thành các hàm code).

### Private key cấp cho School và LocalAuth
```ts
privateKey: DEMO_PRIVATE_KEY_SEED("school-a")   // randomBytes(32).toString("hex")
```
- Theo thiết kế MVP (`docs/Questions.md`), mỗi tài khoản School / LocalAuth sẽ **ký hồ sơ** bằng private key riêng — giống người ký bằng bút, không cần đăng nhập lại.
- Ở đây là **demo**: private key lưu trong cột `private_key` của bảng `users`. Production thật phải quản lý key khác (KMS / HSM / chính người dùng giữ).
- 1 private key cho School → ký hồ sơ của trường mình.
- 1 private key cho LocalAuth → ký / từ chối hồ sơ của khu vực mình.

### 2 hồ sơ mẫu — mỗi trường 1 em

```
Record A: Trường TH Xã A + UBND Xã A → childName "Bé Minh An (Trường A)" → status DRAFT
Record B: Trường TH Xã B + UBND Xã B → childName "Bé Gia Huy (Trường B)" → status PENDING_APPROVAL
```
→ Trẻ em phải gắn với **cụ thể một trường** (`school_id`) và **một UBND xã** duy nhất (`local_auth_id`). Điều này bắt buộc — nếu không thì phân quyền không hoạt động.

### Lệnh `npm run db:seed`
Được thêm vào `package.json` (mục `"scripts"`):
```json
"db:seed": "tsx prisma/seed.ts"
```
`tsx` chạy trực tiếp file TS (không cần build trước). `prisma/seed.ts` tự gọi `prisma.$disconnect()` khi xong.

### Idempotent — chạy lại an toàn
Seed dùng **`upsert`** (update nếu có, insert nếu chưa) → chạy 10 lần vẫn chỉ ra 5 tài khoản, không tạo duplicate. Dữ liệu hồ sơ mẫu thì `deleteMany` rồi `create` lại → luôn về trạng thái sạch 2 bản.

### Tại sao 2 hồ sơ, không phải 21 luôn?
Mục đích giai đoạn này là **chứng minh phân quyền** — cần tối thiểu 2 trường để tách. Khi sang giai đoạn "giao diện công khai MTQ", đã làm thêm `prisma/seed-demo.ts` tạo **21 hồ sơ** (7/trường × 3 trường) — đó là bước sau, không thuộc task này.

---

## 4. "Kiểm chứng cách ly dữ liệu bằng SQL: School A chỉ thấy hồ sơ Trường A, LocalAuth Xã A chỉ thấy hồ sơ Xã A"

### Tại sao kiểm chứng **trước** khi code tính năng?
Thay vì:
> Viết code → chạy → thấy lỗi → sửa

Thiết kế:
> Thiết kế bảng → seed data → **query SQL trực tiếp** → xác nhận quan hệ đúng → **mới viết API**

Seed sai → bắt lỗi ở đây thay vì sau khi đã viết xong API phân quyền.

### Các truy vấn thực tế đã chạy

```sql
-- 5 users đúng role / orgCode
SELECT role, organization_code, email FROM users ORDER BY role;

-- Hồ sơ gắn đúng trường / xã
SELECT r.child_name, r.status,
       s.organization_code AS school,
       l.organization_code AS local_auth
FROM records r
JOIN users s ON s.id = r.school_id
JOIN users l ON l.id = r.local_auth_id;

--   Bé Minh An | DRAFT            | THAXA01 | UBXAA01
--   Bé Gia Huy  | PENDING_APPROVAL | THBXA02 | UBXAB02

-- Filter School A → 1 record
SELECT count(*) FROM records
JOIN users s ON s.id = r.school_id
WHERE s.organization_code = 'THAXA01';   -- 1
```

### Ý nghĩa
- **Mỗi trẻ chỉ thuộc 1 trường** → trường khác không được thấy.
- **Mỗi trẻ chỉ thuộc 1 UBND xã** → UBND khác không thấy.
- **Admin** (sau này) thấy hết.
→ Đây là "định nghĩa dữ liệu" của phân quyền. Task 3 sẽ biến các câu SQL này thành hàm `canAccessRecord` / `canViewL2` và viết test 14 trường hợp cho nó.

---

## 5. "Mục đích: Prove được khả năng phân biệt quyền xem dữ liệu trước khi làm tính năng phân quyền"

### Ngắn gọn
Task 2 chỉ là **CHORE** (việc chân tay, không có logic nghiệp vụ). Nó **chưa** thêm UI hay API nào. Nó chỉ trả lời câu hỏi:

> "Database hiện có tách được quyền xem của 3 vai trò chưa?"

Trước khi viết 1 dòng code tính năng, cần đảm bảo **nền tảng dữ liệu đúng**:
1. Bảng có cột `role`, `organization_code`, `school_id`, `local_auth_id` → ✅ đã xác nhận bằng SQL
2. Seed tạo được nhiều trường hợp (trẻ thuộc trường A, trẻ khác thuộc trường B) → ✅ 2 record
3. Các tài khoản có private key riêng → ✅ chuẩn bị cho task Ký hồ sơ

### Rủi ro nếu bỏ qua bước này
Code phân quyền viết xong mới phát hiện dữ liệu thiếu (vd không có trường thứ 2 để test chéo, hoặc không có UBND) → phải sửa cả schema + seed + API → tốn gấp đôi thời gian.

### Bàn giao cho các task sau

| File | Dùng cho |
|---|---|
| `src/lib/password.ts` | Task 3 — đăng nhập `/login` |
| `prisma/seed.ts` | Demo + test cho mọi task sau |
| `docs/reports/2026-11-10-task-2-database-5-accounts.md` | Tài liệu cho nhóm (quy chuẩn báo cáo) |
| SQL kiểm chứng | Đối chiếu lại khi PR #24 thêm test phân quyền |
