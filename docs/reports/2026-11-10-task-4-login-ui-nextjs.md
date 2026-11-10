# Báo cáo - [FEAT/UI] Trang đăng nhập thật + Giao diện Next.js thật cho 3 actor

- **Ngày:** 2026-11-10
- **Nhánh:** `feat/trinhbinhkhangit/login-ui-nextjs`
- **Nguồn:** 3 task ban đầu đã hoàn thành (Task 2 PR #23, Task 3 PR #24, Task 1 PR #25); nhóm chọn tiếp tục **Trang /login thật + UI Next.js thật** dựa trên prototype (`public/prototype.html`).
- **Nghiệm thu:** Đăng nhập thật bằng tài khoản seed; 3 trang thật phân theo vai trò; UI gọi API có xác thực server; phân quyền giữ nguyên đúng quy tắc Task 3.

## 1. Những việc đã hoàn thành

1. **API xác thực + CRUD đầy đủ** (người gọi phải có session + đúng role):
   - `GET /api/records` — danh sách đã lọc quyền + kèm quan hệ `school`/`localAuth` (hiển thị tên đơn vị)
   - `POST /api/records` — **chỉ ADMIN**: tạo hồ sơ DRAFT (gồm L2)
   - `PATCH /api/records/[id]` — **chỉ ADMIN, chỉ hồ sơ DRAFT**: sửa các trường; `action="submit"` chuyển DRAFT → PENDING_APPROVAL
   - `DELETE /api/records/[id]` — **chỉ ADMIN**
   - `POST /api/records/[id]/sign` — **SCHOOL/LOCAL_AUTH**: `action=sign` tạo chữ ký `sha256(privateKey + ":" + recordId)`; đủ 2 chữ ký (school + localAuth) → hồ sơ tự chuyển **RECEIVING**; `action=reject` bắt buộc `reason`, hồ sơ về DRAFT và xóa cả 2 chữ ký
   - `GET /api/orgs` — **chỉ ADMIN**: danh sách tổ chức SCHOOL/LOCAL_AUTH đang hoạt động cho dropdown form
2. **Trang `/login` thật** (`src/app/login/page.tsx`): form email/password, NextAuth `signIn("credentials")`, lỗi hiển thị rõ, pre-fill tài khoản demo; link tài khoản demo hiện ngay trên trang.
3. **Home (`/`)**: nếu đã đăng nhập → redirect về `/admin` · `/school` · `/localauth` theo role; chưa → landing có nút "Đăng nhập theo vai trò".
4. **3 trang thật** (`src/app/admin|school|localauth/page.tsx`, server component + `requireRole()` — sai role → về `/`; chưa đăng nhập → `/login`):
   - `/admin`: bảng hồ sơ + thêm/sửa(DRAFT)/xóa/gửi duyệt (modal form, dropdown trường/xã lấy từ `/api/orgs`)
   - `/school`: chỉ hồ sơ của trường mình + nút **Ký** / **Từ chối** (bật đúng lúc `PENDING_APPROVAL`)
   - `/localauth`: chỉ hồ sơ xã mình + nút **Ký** / **Từ chối**
5. **Component dùng chung** `src/components/records-board.tsx`: bảng phân quyền, badge trạng thái, ẩn L2 (`childName = null` hiển thị "🔒 L2 ẩn"), thao tác qua API, toast thông báo, modal thêm/sửa.
6. **`src/components/role-shell.tsx`** + **`sign-out-button.tsx`**: khung layout 3 trang (header teal, tên user, nút Đăng xuất).
7. **Kiểm chứng bằng server thật** (`npm run start`, cookie session):
   - Chưa đăng nhập: `GET /admin` → **307 → /login**
   - Đăng nhập admin: `/api/auth/session` trả role `ADMIN`; `/api/records` trả 2 hồ sơ, hồ sơ DRAFT có L2, hồ sơ PENDING_APPROVAL bị che L2 ✅
   - School B (`truong2`): chỉ thấy 1 hồ sơ của mình, L2 **thấy** (đúng quyền); `POST /api/records` → **403**
   - `/admin` với session → **200**

## 2. Mục đích từng việc

| Việc | Mục đích |
|---|---|
| API CRUD đầy đủ + sessionGuard | Phân quyền phải được **enforce ở server**, không chỉ ở UI — client bị sửa/giả mạo cũng không phá được |
| `POST /sign` sinh chữ ký sha256 từ privateKey | Mô phỏng nghiệp vụ "ký hồ sơ bằng private key" của MVP; đủ 2 chữ ký mới RECEIVING (đúng kịch bản demo) |
| `/login` thật | NextAuth đã cấu hình ở Task 3 nhưng chưa có trang đăng nhập → giờ nhóm đăng nhập được ngay bằng tài khoản seed |
| Trang thật thay prototype | Prototype chỉ để xem luồng; trang thật gọi đúng API/role, dữ liệu thật từ Postgres |
| `role-shell` dùng chung | Tránh lặp layout 3 trang; header + logout thống nhất |

## 3. Quyết định đã chốt

- **Chữ ký MVP**: `sha256(privateKey + ":" + recordId)` lưu vào `school_signature` / `local_auth_signature` — chưa lên on-chain (task [FEAT] Ký hồ sơ riêng), chỉ xác nhận bằng cryptography cục bộ cho demo.
- `requireRole()` cho page + `getSessionUser()` cho API — nhất quán 401/403/redirect.
- L2 bị che ở API theo `redactL2` từ Task 3 — không filter lại ở client.
- **Thêm record mới** chỉ ADMIN làm được (spec: Admin nhập hồ sơ); School/LocalAuth **tuyệt đối không** create/update/delete.
- Không thật hóa donation/VietQR ở trang này — ngoài scope lượt này.

## 4. Cách kiểm chứng (chạy lại được)

```powershell
npm run docker:up
npm run db:seed        # nếu DB trống
npm run build
npm run start -- -p 3200
# Trình duyệt: http://localhost:3200/login (demo: admin@nuoi-em.vn / Password123!)
```

Kịch bản test gợi ý:
1. Đăng nhập `admin@nuoi-em.vn` → thấy 2 hồ sơ; hồ sơ `PENDING_APPROVAL` có cột L2 ẩn
2. Thêm hồ sơ mới → xuất hiện trong list (DRAFT) → Gửi duyệt → L2 bị khóa
3. Đăng nhập `truong2@nuoi-em.vn` → chỉ 1 hồ sơ của Trường B; nút Ký bật khi PENDING_APPROVAL
4. Đăng xuất, đăng nhập lại bằng tài khoản khác

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — exit 0
- `npm run lint` — ✓ No ESLint warnings
- `npm run build` — ✓ (routes: /, /login, /admin, /school, /localauth, /api/records, /api/records/[id], /api/records/[id]/sign, /api/orgs)
- Kiểm tra thủ công trên server thật — xem mục 1, việc 7
- `npm run test` — 2 unit cũ + 14 unit mới + 7 contract pass (không đổi)

## 6. Việc còn lại / bàn giao

- **Ghi commitment on-chain khi chuyển RECEIVING** (task [FEAT] Ký hồ sơ) — cần nối `CharityLedger.sol` + `viem` vào bước ký: hiện signature là sha256 off-chain.
- **Webhook VietQR + gắn giao dịch với hồ sơ** — 2 task tiếp theo trong Linear.
- **UI báo cáo (WAITING_FOR_REPORT), duyệt report** cho LocalAuth.
- **Layout chung**: hiện header lặp code qua `role-shell.tsx`; có thể chuyển thành route group `(app)/layout.tsx` khi cần.
- **`/prototype.html`** (Task 1) giữ nguyên để nhóm so sánh UI thật ↔ prototype.

## 7. File đã thêm/sửa

- `src/app/login/page.tsx` (mới) — trang đăng nhập
- `src/app/page.tsx` (sửa) — redirect theo role
- `src/app/admin/page.tsx`, `school/page.tsx`, `localauth/page.tsx` (mới)
- `src/components/records-board.tsx`, `role-shell.tsx`, `sign-out-button.tsx` (mới)
- `src/app/api/records/route.ts` (thêm POST), `api/records/[id]/route.ts` (thêm PATCH/DELETE + quan hệ), `api/records/[id]/sign/route.ts` (mới), `api/orgs/route.ts` (mới)
- `src/lib/require-role.ts` (mới)
