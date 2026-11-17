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

---

# PHẦN 2 — Task 3, Task 1 & các task tự chọn

---

## 6. Task 3 — [FEAT] Cơ chế xác thực phân quyền xem (PR #24 · merge `8edabb3`)
`feat/trinhbinhkhangit/phan-quyen-xem`

### 6.1 Vấn đề nghiệp vụ cần giải quyết

Theo thiết kế MVP, **3 vai trò không được thấy mọi thứ như nhau**. Quan trọng nhất:

| Vai trò | Xem hồ sơ (L1) | Xem/sửa thông tin L2 |
|---|---|---|
| ADMIN | Toàn bộ | Chỉ khi hồ sơ **DRAFT**. Từ `PENDING_APPROVAL` trở lên → **không thấy L2** |
| SCHOOL | Chỉ trẻ của trường mình | Xem L2 của trẻ trường mình (mọi trạng thái) |
| LOCAL_AUTH | Chỉ trẻ của khu vực mình | Xem L2 của trẻ khu vực mình (mọi trạng thái) |

**L1** (công khai): mã hồ sơ, trường, tài khoản, hoàn cảnh. **L2** (bí mật): tên trẻ (`childName`), ảnh trẻ (`childImage`).

### 6.2 `src/lib/permissions.ts` — 4 hàm thuần

| Hàm | Input → Output | Vai trò |
|---|---|---|
| `canAccessRecord(user, record)` | `(SessionUser, record) → boolean` | "User này có được xem hồ sơ không?". Admin → luôn true; School → chỉ đúng `schoolId === user.id`; LocalAuth → chỉ `localAuthId === user.id` |
| `canViewL2(user, record)` | tương tự → `boolean` | "User này có được xem L2 của hồ sơ không?". Admin → chỉ khi `status === "DRAFT"`; School/LocalAuth → khi hồ sơ thuộc đúng phạm vi mình |
| `redactL2(record, user)` | `(record, user) → T & { l2Redacted: boolean }` | Trả **bản sao**, ẩn `childName`/`childImage` nếu không đủ quyền, luôn kèm cờ `l2Redacted` |
| `filterRecordsForUser(records, user)` | `records[] × user → records[]` | Lọc danh sách: bỏ hồ sơ ngoài quyền, che L2 từng bản ghi còn lại |

**Thuần (pure)** = hàm không đọc/ghi DB, không đọc biến global → unit test chạy cực nhanh và không cần Postgres.

```ts
// Admin chỉ xem L2 khi DRAFT
if (user.role === "ADMIN") return record.status === "DRAFT";
```

### 6.3 Bảng lặp lại cho rõ (đúng code trong file)

```
ADMIN:      canAccessRecord → true; canViewL2 → (status === "DRAFT")
SCHOOL:     canAccessRecord → (record.schoolId === user.id); canViewL2 → giống nhau
LOCAL_AUTH: canAccessRecord → (record.localAuthId === user.id); canViewL2 → giống nhau
```

### 6.4 `src/lib/auth.ts` — Authentication thật

Trước Task 3, `authorize()` trả `null` → không ai đăng nhập được. Sau Task 3:

1. Email người dùng gửi lên → tìm user trong DB (`prisma.user.findUnique({ where: { email }})`).
2. `user.isActive` phải true.
3. `verifyPassword(password, user.passwordHash)` (hàm ở mục 2).
4. Trả `{ id, name, email, role }` → NextAuth đưa vào JWT.
5. Callback `jwt` + `session` gắn `id` + `role` vào session → mọi trang/component đọc được `session.user.role` mà không cần query DB lại.

**`trustHost: true`** — lỗi kinh điển NextAuth v5: nó từ chối mọi request khi không biết host nào đáng tin (khi chạy local, proxy…). Thêm dòng này là hết `[auth][error] UntrustedHost`.

### 6.5 API routes bảo vệ dữ liệu

```
GET /api/records        → 401 nếu chưa đăng nhập; trả list đã lọc (School/LocalAuth thấy đúng phạm vi)
GET /api/records/[id]   → 403 nếu hồ sơ không thuộc quyền; L2 ẩn nếu Admin mà status != DRAFT
```

Mọi tính toán phân quyền đều ở **server** — client (trình duyệt) chỉ hiển thị, không quyết định quyền.

### 6.6 Unit tests (14 pass)

- 2 test nền tảng AES-256-GCM (file `crypto.test.ts` có sẵn).
- 12 test mới trong `test/unit/permissions.test.ts` — phủ đủ:
  - Admin: xem mọi hồ sơ; xem L2 ở `DRAFT`; **không thấy L2 khi PENDING_APPROVAL / RECEIVING / WAITING_FOR_REPORT / CLOSED** (4 test).
  - School: đúng trường → thấy L2; khác trường → không xem nổi `canAccessRecord === false` (3 test).
  - LocalAuth: đúng xã → thấy L2; khác xã → không (2 test).
  - `filterRecordsForUser`: Admin thấy tất cả (L2 ẩn khi không phải DRAFT); School/LocalAuth thấy đúng xã/trường; user không hợp lệ (không `id`/`role`) → rỗng (4 test).

### 6.7 Bài học chính

> **Phân quyền chỉ thực sự an toàn khi nó được enforce ở server.** UI có thể bị sửa, request bị giả mạo, dev tools bị mổ xẻ — nhưng code phía server không trả dữ liệu thì hacker cũng không nhận được.

> **L2 chỉ là "lớp" trong dữ liệu**, không phải quyền tự nhiên — tự cắt bớt chứa trong `redactL2`.

---

## 7. Task 1 — [CHORE] Giao diện 3 actor HTML/CSS (PR #25 · merge `0d5a42e`)
`chore/trinhbinhkhangit/giao-dien-3-actor-html-css`

### 7.1 Tiêu chí nghiệm thu thẻ Linear

> *"Một file html/css để team test"*

Do đó **cố tình làm 1 file duy nhất** `public/prototype.html` — không cần cài gì, mở trực tiếp kiểm tra nhanh luồng.

### 7.2 `public/prototype.html` — tự chứa

- HTML + CSS + JS thuần, không build, không package ngoài.
- Mở thẳng `http://localhost:3000/prototype.html` sau khi chạy `npm run dev` (hoặc mở file bằng trình duyệt).
- Dữ liệu lưu `localStorage` → tự thêm/bớt hồ sơ thử mọi lúc; nút **"↺ Khôi phục mẫu"** reset về seed ban đầu.

### 7.3 Mô phỏng đúng `permissions.ts`

Các hàm JS mô phỏng nguyên xi logic server-side:

```js
function canAccess(user, r) {
  if (user.role === "ADMIN") return true;
  if (user.role === "SCHOOL") return r.schoolCode === user.orgCode;
  if (user.role === "LOCAL_AUTH") return r.laCode === user.orgCode;
  return false;
}
function canViewL2(user, r) {
  if (!canAccess(user, r)) return false;
  if (user.role === "ADMIN") return r.status === "DRAFT";
  return true;
}
```

### 7.4 Hành động trong giao diện

| Actor | Hành động được phép | Điều kiện |
|---|---|---|
| ADMIN | Thêm / Sửa / Xóa / Gửi duyệt | Chỉ khi hồ sơ `DRAFT` (ngoại trừ Xóa — luôn được, để test) |
| SCHOOL | Ký / Từ chối | Chỉ khi hồ sơ `PENDING_APPROVAL` và đúng trường; ký 1 bên |
| LOCAL_AUTH | Ký / Từ chối | Chỉ khi hồ sơ `PENDING_APPROVAL` và đúng xã; ký 1 bên |

**Khi cả School và LocalAuth đều ký** → hồ sơ tự chuyển sang `RECEIVING` (đúng nghiệp vụ DRAFT → PENDING_APPROVAL → RECEIVING).

**Từ chối** → nhập lý do → hồ sơ quay về `DRAFT` + xóa cả 2 chữ ký (đúng kịch bản demo 2).

### 7.5 Design — teal/amber, dễ nhìn, mở offline

- Font Awesome 6 (sau khi bạn đổi yêu cầu icon từ emoji).
- Không dùng CDN ngoài → mở được không cần mạng.
- Mỗi actor có nút riêng (Ký / Từ chối / Sửa / Xóa / Gửi duyệt) với icon FA rõ ràng.

---

## 8. Task tự chọn A — Trang `/login` thật + UI Next.js cho 3 actor (PR #26 · merge `573523b`)
`feat/trinhbinhkhangit/login-ui-nextjs`

### 8.1 Trang `/login` (thật)

- Form email + password → gọi `signIn("credentials", { email, password, redirect: false })` của NextAuth.
- Lỗi → hiển thị rõ ("Sai email hoặc mật khẩu…"); đúng → `router.push("/")` → `/` redirect theo role.
- Pre-fill tài khoản demo: `admin@nuoi-em.vn` / `Password123!` (nhanh cho người mới).
- Khung vuông `teal-800` — đồng màu với site thật, không phải draft.

### 8.2 Server components + `requireRole()` — không có URL nào bị "đi vào" nhầm

```ts
export async function requireRole(role: UserRole) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== role) redirect("/");
  return session.user;
}
```

- `/admin`, `/school`, `/localauth` đều gọi `requireRole()` trước khi render.
- Chưa đăng nhập → `redirect("/login")` (307); sai vai trò → `/` (→ role home đúng).

### 8.3 `RecordsBoard` — component dùng chung cho 3 trang

Thay vì lặp code 3 lần, **một component** `src/components/records-board.tsx` nhận prop `role: "ADMIN" | "SCHOOL" | "LOCAL_AUTH"` và tự vẽ UI phù hợp:

- `role === "ADMIN"` → nút "+ Thêm hồ sơ", nút **Sửa** (chỉ khi DRAFT), **Gửi duyệt** (DRAFT → PENDING_APPROVAL), **Xóa**; dropdown chọn trường/xã (gọi `/api/orgs`).
- `role === "SCHOOL"` → chỉ nút **Ký** / **Từ chối** (không thể tạo hồ sơ).
- `role === "LOCAL_AUTH"` → tương tự School.
- Cột "Trẻ (L2)" hiện "🔒 L2 ẩn" nếu không đủ quyền; badge trạng thái theo `DRAFT` / `PENDING_APPROVAL` / `RECEIVING` / `WAITING_FOR_REPORT` / `CLOSED`.
- Toast + modal — thao tác xong tải lại danh sách.

### 8.4 `/api/orgs` — danh sách tổ chức cho dropdown Admin

Trả về danh sách users `SCHOOL` + `LOCAL_AUTH` đang `isActive` (chỉ Admin được gọi). Input chọn trường/xã đến từ đây, không hard-code.

### 8.5 Kiểm thử thật (server production)

```
Chưa đăng nhập: GET /admin  →  307 redirect /login
Sau login admin:              GET /admin  →  200
                               GET /api/records → 2 record; L2 ẩn cho PENDING_APPROVAL (l2Redacted = true)
School truong2 đăng nhập:    GET /api/records → đúng 1 record (Trường B) — không thấy Trường A
                                POST /api/records (tạo)      →  403 Forbidden
```

---

## 9. Task tự chọn B — Giao diện công khai MTQ + Sao kê + VietQR (PR #27 · merge `514c6fc`)
`feat/trinhbinhkhangit/giao-dien-cong-khai-mtq`

### 9.1 Lý do làm thêm

Do sau 3 task chính còn thiếu phần "Mạnh thường quân quyên góp". Kiến nghị lên kế hoạch Linear bổ sung — rồi làm luôn vì thời gian.

### 9.2 `PublicShell` — khung chung cho các trang công khai

- Header xanh teal + nav (`Danh sách hồ sơ` / `Tra cứu` / `Vì sao minh bạch?` / `Đăng nhập`) + footer 3 cột.
- Không đăng nhập — ai cũng xem được.

### 9.3 `/ho-so` — danh sách hồ sơ đang nhận (kèm lọc theo trường)

- Chỉ hiển thị `RECEIVING` + `WAITING_FOR_REPORT`.
- Lưới card: ảnh placeholder màu (không lộ diện trẻ em), hoàn cảnh, tên trường/xã, progress bar (đã nhận / mục tiêu / còn thiếu), số lượt góp.
- Thanh lọc: `Tất cả (9)` · `Trường TH Xã A (3)` · `Trường TH Xã B (3)` · `Trường TH Xã C (3)` — qua `?school=THAXA01`.

### 9.4 `/ho-so/[id]` — trang sao kê công khai

- Hero: mã hồ sơ (rút gọn), tỉ lệ %, thông tin trường/xã.
- **Progress bar** lớn: số tiền đã đối soát / mục tiêu / còn thiếu.
- **Timeline trạng thái**: DRAFT → PENDING_APPROVAL → RECEIVING → WAITING_FOR_REPORT → CLOSED.
- **Bảng sao kê**: liệt kê giao dịch đã xác nhận (transactionId rút gọn, số tiền, thời gian) — **ẩn danh người chuyển**.
- Khung cam kết: commitment on-chain (giải thích nguyên lý hash L1+L2+ salt).

### 9.5 `/ho-so/[id]/quyen-gop` — Luồng quyên góp VietQR

3 bước trong 1 trang:

1. **Chọn số tiền** — preset `100k / 200k / 500k / 1M / 2M` hoặc tự nhập. Hiển thị "còn thiếu bao nhiêu".
2. **QR VietQR** — sinh ảnh `img.vietqr.io/image/…` kèm `amount` + `addInfo = reference_code` (dạng `HSxxxxx-xxxx`, lưu `localStorage` để reload không sinh mã mới).
3. **Countdown 10'** — poll `GET /api/donations/by-ref` mỗi 3s; khi webhook xác nhận → chuyển sang màn hình cảm ơn (ẩn danh).

**Nếu backend chưa cài endpoint** → hiện nút "⚡ Giả lập tiền đã vào" (demo). Sau khi backend xong thì nút tự tắt (HTTP 404).

### 9.6 `/tra-cuu` — Tra cứu giao dịch

- MTQ dán `transaction_id` (từ app ngân hàng sau khi chuyển) → gọi `GET /api/donations/tra-cuu`.
- Kết quả: trạng thái (chờ đối soát / confirmed) + số tiền + thời gian.
- Không cần đăng nhập, không lộ danh tính người chuyển.

### 9.7 `/huong-dan` — "Vì sao minh bạch?"

3 bước tự kiểm chứng cho MTQ (đọc số ngân hàng → so khớp trên chuỗi → tự băm L1+L2+ salt). Kèm cam kết ẩn danh.

### 9.8 `/403` — Trang phân quyền

- Dễ hiểu khi trường/UBND khác vào sai `/admin` của trường khác.

### 9.9 `docs/BACKEND-INTEGRATION-GUIDE.md` — Bàn giao backend

Toàn bộ mô tả những gì frontend đã chạy + chính xác 3 API backend cần viết (contract rõ ràng):

| API | Trạng thái |
|---|---|
| `POST /api/webhook` (nhận IPN VietQR, upsert donation, `transactionId` unique → idempotent) | ⏳ backend |
| `GET /api/donations/by-ref?ref=HSxxxx-xxxx` | ⏳ backend |
| `GET /api/donations/tra-cuu?transactionId=…` | ⏳ backend |

Ngoài ra: quy tắc `reference_code` (`HSxxxxx-xxxx`, parse prefix → tìm `record.id`), sơ đồ mermaid luồng end-to-end, checklist nghiệm thu, SQL tạo dữ liệu demo.

### 9.10 `prisma/seed-demo.ts` + `npm run db:seed-demo`

- Xoá hồ sơ demo cũ → tạo lại **21 hồ sơ (7/trường × 3 trường)**.
- 9 hồ sơ `RECEIVING`, 6 `PENDING_APPROVAL`, 6 `DRAFT`.
- 37 donations với `transactionId`/`referenceCode` dạng chuỗi → đủ cho demo sao kê + tra cứu.
- 1 tài khoản mới: `truong3@nuoi-em.vn` (THCXA03), `localauth_xc@nuoi-em.vn` (UBXAC03) — mật khẩu `Password123!`.

### 9.11 Bugfix & dọn dẹp

- `src/app/layout.tsx` — thêm `import "@fortawesome/fontawesome-svg-core/styles.css"` → icon FA không phình nữa.
- `src/app/icon.svg` — favicon (cây lúa / trái tim).
- `.tsbuildinfo` (cache build) → gỡ khỏi git tracking.
- `TEST.html` (draft thiết kế riêng của bạn) → gỡ khỏi git, giữ nguyên ở local.
- `getPublicRecords`/`getPublicRecord`/`getDonations` — try/catch → nếu Docker chưa chạy, trang không crash (trả danh sách rỗng).

---

## 10. Tài liệu & hỗ trợ team (PR #28 · open)
`docs/getting-started` và các báo cáo trong `docs/reports/`

### 10.1 `docs/GETTING-STARTED.md`

10 bước clone → chạy: Node 22 → `.env` → Docker → `npm ci` → `db:push` → `db:seed` → `npm run dev` → kiểm tra chất lượng (tsc/lint/test/build) + tài khoản demo + troubleshooting.

### 10.2 `docs/architecture.md`

Sơ đồ mermaid (GitHub tự render):
1. Kiến trúc tổng thể (client → Next.js → src/lib → Postgres)
2. Vòng đời hồ sơ (state machine 5 trạng thái)
3. Luồng dữ liệu L1/L2/commitment (on-chain chỉ có hash)
4. Luồng VietQR + webhook
5. Ai làm gì (bảng quyền tóm tắt)

### 10.3 `docs/BACKEND-INTEGRATION-GUIDE.md`

Chi tiết ở mục 9.9 — toàn bộ giao kèo cho backend team.

### 10.4 `docs/reports/` — 5 báo cáo theo quy chuẩn

Mỗi task xong → 1 báo cáo, gồm: việc đã làm · mục đích · quyết định chốt · cách kiểm chứng · chất lượng · bàn giao. Đặt tên theo `docs/reports/README.md`.

| Báo cáo | Task |
|---|---|
| `2026-11-10-task-2-database-5-accounts.md` | Task 2 (create + 5 tài khoản) |
| `2026-11-10-task-3-phan-quyen-xem.md` | Task 3 (FEAT phân quyền) |
| `2026-11-10-task-1-giao-dien-3-actor.md` | Task 1 (3 actor HTML/CSS) |
| `2026-11-10-task-4-login-ui-nextjs.md` | Tự chọn A (/login thật) |
| `2026-11-15-task-5-giao-dien-cong-khai.md` | Tự chọn B (công khai + VietQR) |

### 10.5 `TRINH_BINH_KHANG_CHECK_LIST.md` (PR #29)

Bảng tổng hợp dưới dạng checklist — người đọc lướt nhanh thấy mọi task + trạng thái CI + PR.

---

## 11. Tổng kết 9 mục tiêu của nhóm bạn

```
[ x ] Clone project về, chạy được             ← PR #22 (bạn là người đầu tiên merge)
[ x ] Lấy tên nhánh từ Linear                  ← docs/trinhbinhkhangit/nuo-2-connect-your-tools
[ x ] docker compose up + db:push             ← Task 2
[ x ] 5 tài khoản seed                         ← Task 2
[ x ] Chứng minh cách ly dữ liệu bằng SQL      ← Task 2
[ x ] [FEAT] Phân quyền có test                ← Task 3 (14/14 pass)
[ x ] [CHORE] Giao diện 3 actor                ← Task 1
[ x ] /login thật + 3 trang thật               ← PR #26
[ x ] Trang MTQ + sao kê + VietQR              ← PR #27
```
