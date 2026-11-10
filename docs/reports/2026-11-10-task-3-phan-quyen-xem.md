# Báo cáo Task 3 - [FEAT] Cơ chế xác thực phân quyền xem (Admin / School / LocalAuth)

- **Ngày:** 2026-11-10
- **Nhánh:** `feat/trinhbinhkhangit/phan-quyen-xem`
- **Task:** [FEAT] Cơ chế xác thực phân quyền xem của admin, school và localauth
- **Nghiệm thu:** Admin xem/nhập L2 khi hồ sơ ở DRAFT; Admin không xem được L2 từ PENDING_APPROVAL trở lên; School chỉ xem trẻ của trường mình; LocalAuth chỉ xem trẻ của khu vực mình; **có test từng quy tắc, đều pass**.

## 1. Những việc đã hoàn thành

1. **Tầng lõi phân quyền** `src/lib/permissions.ts` (hàm thuần, dễ test):
   - `canAccessRecord(user, record)` — ai xem được hồ sơ: Admin toàn bộ; School `record.schoolId === user.id`; LocalAuth `record.localAuthId === user.id`
   - `canViewL2(user, record)` — Admin chỉ khi `status === "DRAFT"`; School/LocalAuth khi hồ sơ gắn trường/xã của mình
   - `redactL2(record, user)` — trả bản sao hồ sơ đã ẩn `childName`, `childImage` nếu không đủ quyền (cộng cờ `l2Redacted`)
   - `filterRecordsForUser(records, user)` — lọc + che L2 hàng loạt
   - `PERMISSION_RULES` — bảng mô tả quyền để tài liệu/API dùng
2. **Đăng nhập thật thay placeholder** `src/lib/auth.ts`: Credentials provider đối chiếu `email` + mật khẩu băm bằng `verifyPassword` (scrypt), trả `{ id, name, email, role }`, JWT + session callback mang `id` + `role`.
3. **Type augmentation** `src/types/next-auth.d.ts`: session/JWT có `role: UserRole`.
4. **`src/lib/session.ts`**: helper `getSessionUser()` lấy `id` + `role` từ NextAuth session (trả `null` nếu chưa đăng nhập).
5. **API routes**:
   - `GET /api/records` — danh sách hồ sơ theo quyền người đăng nhập, L2 đã che nếu không đủ quyền
   - `GET /api/records/[id]` — chi tiết 1 hồ sơ; 403 nếu hồ sơ không thuộc quyền xem; L2 ẩn nếu không đủ quyền
   - Server thật trả **401 Unauthorized** khi chưa đăng nhập ✅ (kiểm chứng bằng `npm run start`)
6. **14/14 unit test pass** `test/unit/permissions.test.ts` — phủ từng quy tắc: Admin (L1 mọi trạng thái, L2 chỉ DRAFT, ẩn L2 từ PENDING_APPROVAL), School (đúng trường / khác trường), LocalAuth (đúng xã / khác xã), `filterRecordsForUser`, user không hợp lệ.
7. **Fix lỗi UntrustedHost của NextAuth v5** — thêm `trustHost: true` vào `auth.ts` + dòng `AUTH_TRUST_HOST="true"` vào `.env.example` (và `.env` cá nhân, không commit). Trước đó gọi `/api/auth/*` trên localhost báo `[auth][error] UntrustedHost: Host must be trusted`.
8. Kiểm tra chất lượng: `tsc:0`, `lint` sạch, `build` pass (6 routes, thêm `/api/records`, `/api/records/[id]`), 14 unit pass + 7 contract test pass.

## 2. Mục đích từng việc

| Việc | Mục đích |
|---|---|
| `permissions.ts` thuần túy | Toàn bộ quy tắc nghiệp vụ tập trung 1 chỗ, không lẫn với framework → test dễ, tái sử dụng (API, server actions, UI) |
| auth.ts thật | Trước đây chỉ `return null` nên không ai đăng nhập được; giờ 5 tài khoản seed của Task 2 mới dùng được để demo |
| JWT + session mang role | Cần `role` phía client/API để lọc quyền mà không phải query DB mỗi lần |
| API routes lọc theo quyền | "Phân quyền xem" phải được ENFORCE ở server — che L2 ở client là yếu |
| Unit tests | Đảm bảo 4 quy tắc được giữ đúng khi code thay đổi sau này |
| redactL2 không sửa object gốc | Tránh rò rỉ dữ liệu qua mutate ngoài ý muốn |

## 3. Quyết định đã chốt

- **"Khu vực mình"** của LocalAuth = `records.local_auth_id` (theo báo cáo Task 2). Mỗi trẻ gắn đúng UBND xã phụ trách → LocalAuth chỉ lọc theo `local_auth_id`, không cần bảng khu vực riêng ở MVP.
- **L1**: mã hồ sơ, trường, tài khoản, xã, hoàn cảnh, status... → ai có quyền truy cập hồ sơ đều xem được.
- **L2**: chỉ `childName`, `childImage` → ẩn (set `null`) khi không đủ quyền.
- **Admin ký hồ sơ?** Không — Admin chỉ soạn Draft; ký là quyền School/LocalAuth (đúng nghiệp vụ MVP).
- 401 khi chưa đăng nhập; 403 khi hồ sơ không thuộc phạm vi mình — phân biệt rõ 2 lỗi cho dễ debug/test.
- API `/api/records` KHÔNG lọc né (school khác trường) khiến lộ id → đã che bằng `canAccessRecord`; trường hợp 1 bản ghi khó truy cập trả 403 (không trả id/childName).

## 4. Cách kiểm chứng (chạy lại được)

```powershell
npx tsc --noEmit
npm run lint
npm run test:unit        # 14 tests pass
npm run test
npm run build
npm run start -- -p 3100
# Trên terminal khác:
curl.exe http://localhost:3100/api/records   # -> 401 {"error":"Chưa đăng nhập"}
```

Xem tài khoản demo: `docs/reports/2026-11-10-task-2-database-5-accounts.md` (Task 2).

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — exit 0
- `npm run lint` — ✓ No ESLint warnings
- `npm run test:unit` — 14 pass / 0 fail
- `npm run test` (unit + contracts) — 14 + 7 pass
- `npm run build` — ✓ Compiled successfully

## 6. Việc còn lại / bàn giao

- **UI đăng nhập thật (`/login`)**: trang đang chưa tồn tại (NextAuth trỏ `pages.signIn=/login`). Thuộc Task 1 [CHORE] giao diện — làm cùng giao diện 3 actor.
- **Giao diện 3 actor** hiển thị đúng view theo role (Admin nhập Draft thấy L2; School ký; LocalAuth duyệt báo cáo).
- **Ký hồ sơ bằng private key** (task [FEAT] Ký hồ sơ) — dùng `privateKey` đã seed trong Task 2.
- **Chưa encrypt L2 trong DB** — L2 đang lọc theo quyền; việc lưu mã hóa AES-256-GCM cho `childName`/`childImage` ở DB thuộc task [FEAT] Chia cấp dữ liệu (chưa có trong 3 task hiện tại).
- **One-time link cho MTQ xem L2** — ngoài scope MVP, đã ghi ở `docs/Questions.md` mục câu hỏi quyết định.

## 7. API đã thêm

| Endpoint | Auth | Mô tả |
|---|---|---|
| `GET /api/records` | Đăng nhập | Danh sách hồ sơ theo quyền; L2 bị che nếu không đủ quyền |
| `GET /api/records/:id` | Đăng nhập | Chi tiết 1 hồ sơ; 403 nếu không thuộc phạm vi; L2 ẩn nếu Admin và status != DRAFT |
