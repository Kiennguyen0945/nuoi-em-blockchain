# Báo cáo Task 2 - [CHORE] Tạo bảng cơ sở dữ liệu với 3 quyền (School, Admin, LocalAuth)

- **Ngày:** 2026-11-10
- **Nhánh:** `chore/trinhbinhkhangit/tao-bang-csdl-3-quyen`
- **Linear (nguồn task):** [CHORE] Tạo bảng cơ sở dữ liệu với 3 quyền căn bản là School, Admin, LocalAuth
- **Tiêu chí nghiệm thu của thẻ:** Một bảng cơ sở dữ liệu dự theo thiết kế của `database.puml`; 5 tài khoản (1 admin, 2 school, 2 localAuth) chứng minh luồng trường này không thể xem thông tin trẻ em trường khác.

## 1. Những việc đã hoàn thành

1. **Xác nhận schema đã khớp thiết kế `docs/database.puml`** — 4 bảng `users`, `records`, `donations`, `audit_logs` đã có sẵn trong `prisma/schema.prisma`, đủ trường theo UML (role, password_hash, school_id, local_auth_id, child_name, child_image,...). Không tạo lại bảng để tránh lệch.
2. **Bổ sung lớp hash mật khẩu** `src/lib/password.ts` — dùng `node:crypto` scrypt (project chưa có bcrypt). Có `hashPassword()` + `verifyPassword()` (so sánh an toàn `timingSafeEqual`).
3. **Bổ sung seed script** `prisma/seed.ts` + lệnh npm `npm run db:seed` — tạo:
   - 1 ADMIN: `admin` / `admin@nuoi-em.vn`
   - 2 SCHOOL: `truong_a` (`truong1@nuoi-em.vn`, THAXA01), `truong_b` (`truong2@nuoi-em.vn`, THBXA02)
   - 2 LOCAL_AUTH: `localauth_a` (`localauth_xa@nuoi-em.vn`, UBXAA01), `localauth_b` (`localauth_xb@nuoi-em.vn`, UBXAB02)
   - Mật khẩu chung 5 TK: `Password123!`
   - Private key ngẫu nhiên cho 2 school + 2 localAuth (đúng thiết kế MVP: mỗi tài khoản ký 1 private key riêng, lưu local DB)
   - 2 hồ sơ trẻ em: `Bé Minh An (Trường A)` (DRAFT, gắn Trường A + UBND Xã A), `Bé Gia Huy (Trường B)` (PENDING_APPROVAL, gắn Trường B + UBND Xã B)
4. **Kiểm chứng cách ly dữ liệu bằng truy vấn SQL** (docker exec psql):
   - 5 users đúng role/organization_code
   - Hồ sơ A chỉ gắn `THAXA01` + `UBXAA01`, hồ sơ B chỉ gắn `THBXA02` + `UBXAB02`
   - Filter theo trường A → 1 record; filter theo localAuth Xã A → 1 record
5. **Kiểm tra chất lượng:** `db:push` đồng bộ, `db:seed` chạy sạch, `tsc`/`lint`/`test`/`build` đều pass (xem phần 4).

## 2. Mục đích của từng việc

| Việc | Mục đích |
|---|---|
| Giữ schema, chỉ đồng bộ (`db:push`) | Tránh tạo trùng bảng; schema đã đúng UML, chỉ cần bảo đảm DB đã apply |
| `password.ts` | Trường `password_hash` trong UML phải lưu mật khẩu đã băm; chuẩn bị nền cho đăng nhập (Task 3) |
| `prisma/seed.ts` + `db:seed` | Tạo nhanh 5 tài khoản chuẩn để demo phân quyền, không phải thêm tay qua Studio (dễ sai, không tái lập lại được) |
| Hồ sơ mẫu 2 trẻ ở 2 trường | Bắt buộc để chứng minh "trường này không xem được thông tin trẻ trường khác" |
| Private key cho school/localAuth | Phục vụ nghiệp vụ ký hồ sơ (task [FEAT] Ký hồ sơ) sau này |
| SQL kiểm chứng | Đảm bảo dữ liệu seed đúng trước khi làm phân quyền |

## 3. Quyết định đã chốt

- **"LocalAuth khu vực mình"** chưa có cột riêng trong `database.puml` → dùng `records.local_auth_id` (mỗi trẻ thuộc 1 localAuth) hoặc `organizationCode` làm mã xã/phường. Task 3 sẽ dùng `local_auth_id` để lọc, và sẽ bổ sung cột `localAuthId` cho `Donation`-related view nếu cần.
- **`situation` (hoàn cảnh)** xếp L1 (off-chain công khai); L2 chỉ gồm `childName`, `childImage` (theo `docs/Questions.md`).
- Seed dùng `upsert` theo email + `deleteMany` records demo cũ → chạy lại `npm run db:seed` an toàn, không bị trùng.

## 4. Cách kiểm chứng (làm lại được)

```powershell
npm run docker:up        # nếu Docker chưa chạy
npm run db:push
npm run db:seed
docker exec charity_ledger_postgres psql -U postgres -d charity_ledger -c "SELECT role, organization_code, email FROM users ORDER BY role;"
```

Xem dữ liệu tại Prisma Studio: `npm run db:studio` → bảng `users`, `records`.

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — pass
- `npm run lint` — pass
- `npm run test` (2 unit + 7 contracts) — pass
- `npm run build` — pass
- `npm run db:seed` — hoàn tất, 5 tài khoản + 2 hồ sơ mẫu

## 6. Việc còn lại / bàn giao cho Task 3 ([FEAT] Phân quyền)

- Wiring `src/lib/auth.ts` (đang là placeholder) để đăng nhập bằng email/password qua `verifyPassword`.
- Viết `canAccessRecord(user, record)` + `filterL2(user, record)`:
  - Admin: thấy/nhập L2 khi `DRAFT`; ẩn L2 từ `PENDING_APPROVAL` trở lên
  - School: chỉ `record.schoolId === session.user.id`
  - LocalAuth: chỉ `record.localAuthId === session.user.id`
- Thêm test cho từng quy tắc (unit test).
- Không thuộc scope task này: giao diện UI (Task 1 CHORE riêng).

## 7. Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| ADMIN | admin@nuoi-em.vn | Password123! |
| SCHOOL (Trường A) | truong1@nuoi-em.vn | Password123! |
| SCHOOL (Trường B) | truong2@nuoi-em.vn | Password123! |
| LOCAL_AUTH (Xã A) | localauth_xa@nuoi-em.vn | Password123! |
| LOCAL_AUTH (Xã B) | localauth_xb@nuoi-em.vn | Password123! |
