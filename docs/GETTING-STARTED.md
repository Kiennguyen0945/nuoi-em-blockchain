# Getting Started — Chạy Nuôi Em Blockchain trên máy mới

Tài liệu dành cho thành viên mới clone project về. Làm đúng theo thứ tự này là chạy được.

## 0. Yêu cầu trước (cài một lần)

- **Node.js 22** (khớp với CI của dự án; Node 24 cũng chạy nhưng khuyên dùng Node 22)
- **Docker Desktop** đã cài và đang chạy (kiểm tra: `docker --version`)

## 1. Clone + cấu hình môi trường

```powershell
git clone https://github.com/Kiennguyen0945/nuoi-em-blockchain.git
cd nuoi-em-blockchain
copy .env.example .env
```

> `.env` dùng được ngay với giá trị mặc định cho môi trường dev (Postgres chạy trong Docker, khoá AES mẫu). Khi deploy thật mới cần đổi `AUTH_SECRET` và tham số VietQR.

## 2. Bật Postgres bằng Docker

```powershell
npm run docker:up          # tương đương: docker compose up -d
docker compose ps         # đợi tới khi postgres chuyển "healthy"
```

## 3. Cài thư viện + đồng bộ schema

```powershell
npm ci                    # cài đúng phiên bản theo package-lock.json
npm run db:push           # tạo bảng theo prisma/schema.prisma + chạy db:generate
```

## 4. Nạp dữ liệu demo (chọn một)

```powershell
npm run db:seed           # 5 tài khoản demo (1 admin, 2 school, 2 localAuth)
npm run db:seed-demo      # 21 hồ sơ = 7 em/trường × 3 trường + 37 donations (~35 triệu)
npm run db:studio         # (tuỳ chọn) mở giao diện duyệt bảng tại http://localhost:5555
```
> `db:seed-demo` sẽ xoá và tạo lại các hồ sơ seed cũ — chỉ dùng khi cần reset dữ liệu demo.

## 5. Chạy app

```powershell
npm run dev               # http://localhost:3000
```

## 6. Kiểm tra chất lượng trước khi commit (bắt buộc)

```powershell
npx prisma db push
npx tsc --noEmit
npm run lint
npm run test              # unit + contract tests
npm run build
```

## 7. Tài khoản demo

| Vai trò | Email |
|---|---|
| Admin | `admin@nuoi-em.vn` |
| School | `truong1@nuoi-em.vn`, `truong2@nuoi-em.vn`, `truong3@nuoi-em.vn` |
| LocalAuth | `localauth_xa@nuoi-em.vn`, `localauth_xb@nuoi-em.vn`, `localauth_xc@nuoi-em.vn` |
| Mật khẩu chung | `Password123!` |

## 8. Các trang cần biết

| Trang | URL |
|---|---|
| Trang chủ công đồng | http://localhost:3000 |
| Danh sách hồ sơ đang nhận | http://localhost:3000/ho-so |
| Chi tiết hồ sơ | http://localhost:3000/ho-so/<id> |
| Tra cứu donation | http://localhost:3000/tra-cuu |
| Đăng nhập (3 vai trò) | http://localhost:3000/login |
| Prototype designer draft | http://localhost:3000/prototype.html |

## 9. Quy trình làm việc nhóm (tóm tắt)

1. Lấy thẻ trên Linear → copy tên nhánh → tạo nhánh `prefix/ten-nhanh` (`feat/`, `fix/`, `chore/`, `docs/`)
2. Code + test (mục 6) → push → PR → chờ CI xanh → Merge → xoá nhánh
3. Tuyệt đối **không push thẳng vào `main`**
4. Mỗi task xong → 1 file báo cáo trong `docs/reports/` theo `docs/reports/README.md`

## 10. Troubleshooting

| Lỗi | Cách xử lý |
|---|---|
| `P1001: Can't reach database server at localhost:5432` | `docker compose ps` kiểm tra; `docker compose up -d` hoặc `docker compose restart` |
| `EUSAGE: npm ci … lock file out of sync` | `npm install` để cập nhật lock, không dùng `--package-lock-only` bằng npm 11 |
| Icon FontAwesome bị phình toàn màn hình | Thiếu `@fortawesome/fontawesome-svg-core/styles.css` trong `layout.tsx` (đã fix) |
| Docker Desktop tắt đột ngột | Mở lại Docker Desktop, đợi `healthy`, đừng xoá `.next` khi dev server đang chạy |
