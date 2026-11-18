# HOÀN THÀNH CÁC NHIỆM VỤ CỦA TRÌNH BÌNH KHANG — 2026-11-18

## Quy trình nhóm (Linear → PR → CI xanh)

- [x] Kết nối Linear + GitHub, làm quen quy trình nhóm
- [x] Clone project, chạy Docker + `db:push` + `db:seed`
- [x] Tạo PR, chạy CI/CD, merge vào `main`

## 3 Task chính được giao (đều merge vào `main`)

- [x] **Task 2** — [CHORE] Tạo database + 5 tài khoản (1 admin, 2 school, 2 localAuth) · PR #23
- [x] **Task 3** — [FEAT] Cơ chế phân quyền xem (Admin/School/LocalAuth) · PR #24
- [x] **Task 1** — [CHORE] Giao diện 3 actor (HTML/CSS) · PR #25

## Các task tự chọn làm thêm

- [x] `/login` thật + UI Next.js cho 3 actor (CRUD, ký/từ chối) · PR #26
- [x] Trang MTQ công khai + sao kê + VietQR quyên góp · PR #27
- [x] Trang tra cứu hồ sơ công khai theo mã (`/tra-cuu-ho-so`) · PR #37
- [x] 21 hồ sơ demo (ví dụ dữ liệu để test) · commit vào repo
- [x] Sơ đồ kiến trúc + tài liệu tích hợp backend + hướng dẫn clone/chạy · PR #28 ("docs: GETTING-STARTED.md")
- [x] Báo cáo tổng hợp dự án — `TRINH_BINH_KHANG_CHECK_LIST.md`, giải thích chi tiết + giới thiệu dự án · PR #29, #34, #39 (mọi PR còn mở, chờ merge)
- [x] Font Awesome, favicon, fix icon phình, fix footer, bỏ tsbuildinfo khỏi git

## Kết quả

- App chạy tại `http://localhost:3000` — Docker Postgres + `npm run dev`
- Demo 3 vai trò: admin/truong/localauth (mật khẩu `Password123!`)
- CI trên `main` đang xanh
- 5 báo cáo trong `docs/reports/`, tài liệu cho backend/future dev

*Cập nhật 2026-11-18 · Trình Bình Khang*
