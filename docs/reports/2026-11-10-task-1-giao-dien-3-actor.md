# Báo cáo Task 1 - [CHORE] Xây dựng giao diện school, admin và localAuth cơ bản (HTML/CSS)

- **Ngày:** 2026-11-10
- **Nhánh:** `chore/trinhbinhkhangit/giao-dien-3-actor-html-css`
- **Task:** [CHORE] Xây dựng giao diện school, admin và localAuth căn bản bằng html/css
- **Nghiệm thu:** Dựa vào phân tích nghiệp vụ xây dựng giao diện cơ bản cho 3 actor; CRUD cơ bản; **Một file html/css để team test**.

## 1. Những việc đã hoàn thành

1. **Một file duy nhất** `public/prototype.html` — tự chứa HTML + CSS + JS thuần (không cần cài gì, không phụ thuộc framework), xem được bằng 2 cách:
   - Mở trực tiếp file bằng trình duyệt
   - `npm run dev` / `npm run start` → `http://localhost:3000/prototype.html`
2. **3 actor + "đăng nhập giả" để test:** chuyển vai trò bằng dropdown trên topbar — 1 Admin, 2 School (THAXA01/THBXA02), 2 LocalAuth (UBXAA01/UBXAB02) — đúng bộ tài khoản demo Task 2.
3. **Giao diện đầy đủ theo nghiệp vụ:**
   - Sidebar: Tổng quan / Hồ sơ / Quy tắc quyền
   - Bảng thống kê: số hồ sơ, DRAFT, chờ ký, đang nhận, đã đóng
   - Bảng hồ sơ với cột mã, trẻ (L2), hoàn cảnh, mục tiêu, trạng thái, đơn vị, hành động
4. **Quyền mô phỏng đúng quy tắc hệ thống** (copy từ `src/lib/permissions.ts`):
   - Admin: xem L2 khi DRAFT; ẩn L2 từ PENDING_APPROVAL trở lên
   - School: chỉ thấy trẻ của trường mình; LocalAuth: chỉ thấy trẻ của xã mình
   - Nút Ký/Từ chối chỉ bật khi hồ sơ `PENDING_APPROVAL` và đúng trường/xã; ký đủ 2 bên → hồ sơ chuyển `RECEIVING`
   - Admin chỉ Sửa/Xóa/Gửi duyệt khi DRAFT
5. **CRUD đầy đủ (trên dữ liệu local):**
   - **Thêm:** modal form (tên trẻ, hoàn cảnh, mục tiêu, số TK trường, đơn vị, trạng thái) — chỉ Admin
   - **Sửa:** chỉ khi hồ sơ DRAFT — Admin
   - **Xóa:** Admin, có confirm
   - **Ký / Từ chối:** School & LocalAuth, từ chối yêu cầu nhập lý do → hồ sơ quay về DRAFT, xóa chữ ký
6. **Dữ liệu lưu bằng `localStorage`** + nút **"↺ Khôi phục mẫu"** để reset về seed (giống Task 2).
7. **Đã kiểm chứng bằng trình duyệt thật:** render đúng, chuyển vai trò Admin → LocalAuth Xã A: chỉ thấy `rec-1` (trẻ Xã A), bị ẩn `rec-2` thuộc Xã B — đúng cách ly.
8. Kiểm tra chất lượng: `tsc:0`, `lint` sạch, `build` pass (route `/prototype.html` được serve từ `public/`).

## 2. Mục đích từng việc

| Việc | Mục đích |
|---|---|
| Một file `public/prototype.html` | Tiêu chí nghiệm thu "một file html/css để team test"; đặt trong `public/` để Next.js serve sẵn, ai chạy project cũng vào được |
| Đăng nhập giả bằng dropdown | Nhóm test nhanh 3 actor + 5 tài khoản mà không cần dựng cơ chế login phức tạp ở prototype |
| Mô phỏng đúng `permissions.ts` | Prototype phải phản ánh luật thật — nhóm nhìn vào hiểu ngay ai thấy gì |
| CRUD trên localStorage | Team tự thêm/xóa hồ sơ khi test mà không đụng DB thật, không ảnh hưởng dữ liệu seed |
| Bảng "Quy tắc quyền" trong app | Biến tiêu chí nghiệm thu Task [FEAT] thành tài liệu xem được ngay trong giao diện |

## 3. Quyết định đã chốt

- Prototype **độc lập** với Next.js App Router — không tạo thêm route/page thật; chỉ là file tĩnh trong `public/`. Khi làm giao diện thật (Next.js pages), có thể port từ đây.
- Public URL `http://localhost:3000/prototype.html` (không yêu cầu đăng nhập) — đúng mục đích "team test"; **không dùng để nhập dữ liệu thật**.
- Không gọi API thật ở prototype (tránh phụ thuộc DB), vì nghiệm thu yêu cầu "một file html/css"; prototype là bản xem luồng, không phải production.
- Dùng bảng màu teal/amber (gần với chủ đề từ thiện), font hệ thống, không dùng CDN — mở được offline.
- Ký = đánh dấu cờ `schoolSigned`/`laSigned`; đủ 2 → `RECEIVING` (đúng nghiệp vụ DRAFT → PENDING_APPROVAL → RECEIVING).

## 4. Cách kiểm chứng

```powershell
npm run dev          # hoặc: npm run start
# Trình duyệt: http://localhost:3000/prototype.html
# Mở trực tiếp file public/prototype.html cũng được
```

Kịch bản test gợi ý cho nhóm:
1. Chọn **Admin** → Thêm hồ sơ mới → Sửa/Gửi duyệt → thấy L2 khi DRAFT
2. Chuyển **Admin** từ DRAFT sang PENDING_APPROVAL → cột L2 bị ẩn
3. Chọn **Cô Lan (Trường A)** → chỉ thấy `rec-1`; nút Ký bật/tắt đúng trạng thái
4. Chọn **UBND Xã A** → chỉ thấy trẻ Xã A
5. Nút **↺ Khôi phục mẫu** để reset

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — exit 0
- `npm run lint` — ✓ No ESLint warnings
- `npm run build` — ✓ Compiled successfully (prototype.html được serve từ public/)
- Trình duyệt render OK (đã chụp màn hình Admin view + LocalAuth Xã A view)

## 6. Việc còn lại / bàn giao

- **Trang đăng nhập thật** `/login` (NextAuth đã cấu hình, `pages.signIn = /login`) — dùng `src/lib/auth.ts` + `verifyPassword`.
- **Giao diện thật bằng Next.js pages** (port từ prototype): `/admin`, `/school`, `/localauth` — khi có yêu cầu rõ, làm thành route riêng thay vì prototype file.
- **Ký hồ sơ bằng private key thật** (task [FEAT] Ký hồ sơ) — prototype mới mô phỏng cờ ký.
- **VietQR/webhook + donation flow UI** — task [FEAT] VietQR.

## 7. File đã thêm/sửa

- `public/prototype.html` (mới, ~600 dòng, tự chứa)
- `docs/reports/2026-11-10-task-1-giao-dien-3-actor.md` (báo cáo này)
