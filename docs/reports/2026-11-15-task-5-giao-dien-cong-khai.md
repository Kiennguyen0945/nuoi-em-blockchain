# Báo cáo - Giao diện công khai MTQ + Sao kê + VietQR + Tra cứu + Trang hướng dẫn

- **Ngày:** 2026-11-15
- **Nhánh:** `feat/trinhbinhkhangit/giao-dien-cong-khai-mtq`
- **Phạm vi:** Cài đặt phần "B" của danh sách frontend đã duyệt (A1..A6 giữ nguyên).
- **Nghiệm thu:** MTQ không đăng nhập vẫn xem được hồ sơ + sao kê, quét QR VietQR chuyển tiền với mã ẩn danh, tra cứu bằng transaction_id.

## 1. Những việc đã hoàn thành

| # | Route | Mô tả |
|---|---|---|
| B1 | `/` | Trang chủ cộng đồng: hero, số liệu (hồ sơ, đang nhận, lượt góp, tổng đã đối soát), 3 bước quyên góp, cam kết blockchain + CTA "Chọn hồ sơ" |
| B2 | `/ho-so` | Grid danh sách hồ sơ đang tiếp nhận (ảnh placeholder màu ẩn danh, tiến độ %, số lượt góp, CTA) |
| B3 | `/ho-so/[id]` | Chi tiết hồ sơ: hero, L1 công khai, timeline trạng thái, progressbar, bảng sao kê donation công khai (không lộ danh tính MTQ) |
| B4 | `/ho-so/[id]/quyen-gop` | Luồng quyên góp 3 bước: chọn số tiền → QR VietQR (amount + nội dung = reference_code ẩn danh) → poll trạng thái; chỉ mở khi hồ sơ `RECEIVING` |
| B5 | `/tra-cuu` | Tra cứu khoản chuyển bằng transaction_id — UI đầy đủ, cần backend `GET /api/donations/tra-cuu` |
| B6 | `/huong-dan` | "Vì sao minh bạch?" — 3 bước tự kiểm chứng + commitment on-chain |
| B19/20 | `/403` | Trang lỗi 403 ngăn cách quyền; 404 mặc định |
| — | `docs/BACKEND-INTEGRATION-GUIDE.md` | Tài liệu bàn giao backend (mục 4: 3 API contract + mục 5 env + mục 7 checklist) |

## 2. Mục đích

- MTQ không cần tài khoản, không ví crypto — chỉ cần app ngân hàng quét QR.
- Sao kê công khai số liệu ngân hàng thực → không thể tự khai sai số tiền đã nhận.
- `reference_code` ẩn danh giúp ghép donation ↔ hồ sơ mà không lộ người chuyển.
- Trần bảo mật: không hiển thị L2 (tên/ảnh trẻ) & không hiển thị thông tin MTQ ở bất kỳ trang công khai nào.

## 3. Quyết định đã chốt

- Server Component truy vấn **Prisma trực tiếp** (dùng `getPublicRecords/getPublicRecord/getDonations` trong `src/lib/public.ts`) — không tạo REST public để giảm việc cho backend; backend tập trung vào webhook + donation APIs.
- Generate QR qua `img.vietqr.io` — không nhúng API riêng, cần `NEXT_PUBLIC_VIETQR_BANK_ID` (mặc định MB).
- **Reference code** sinh ở client, lưu localStorage; backend parse prefix (mục 2, cách A) hoặc bảng pending (cách B) — chi tiết trong BACKEND-INTEGRATION-GUIDE.md.
- `transactionId` là `@unique` → idempotency tự nhiên khi webhook re-send.
- Ảnh trẻ dùng placeholder màu + icon (không ảnh thật) — tránh lộ diện trẻ em trước khi báo cáo hoàn tất.

## 4. Cách kiểm chứng

```powershell
npm run build      # pass (xem section 5)
npm run dev        # mở http://localhost:3000
```

Trang chủ `/`, `/ho-so` (nếu DB trống: hiển thị trạng thái đẹp "Chưa có hồ sơ..."), `/ho-so/<id>`, `/ho-so/<id>/quyen-gop` (chỉ khi hồ sơ RECEIVING — xem SQL ở BACKEND-INTEGRATION-GUIDE.md mục 6), `/tra-cuu`, `/huong-dan`, `/403`.

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — exit 0
- `npm run lint` — ✓ No ESLint warnings
- `npm run build` — ✓ 18 routes (thêm: `/ho-so`, `/ho-so/[id]`, `/ho-so/[id]/quyen-gop`, `/tra-cuu`, `/huong-dan`, `/403`)
- `npm run test` — không thay đổi logic nghiệp vụ (14 unit + 7 contract pass)

## 6. Điểm còn lại / bàn giao

- Backend (đồng đội): `POST /api/webhook`, `GET /api/donations/by-ref`, `GET /api/donations/tra-cuu` — contract trong `docs/BACKEND-INTEGRATION-GUIDE.md`.
- Sau khi backend xong: xóa nút "⚡ Giả lập tiền đã vào" trên trang quyên góp.
- Sau khi có sao kê thật: cập nhật report.

## 7. File đã thêm/sửa

- `src/app/page.tsx` (viết lại — trang cộng đồng)
- `src/app/ho-so/page.tsx`, `ho-so/[id]/page.tsx`, `ho-so/[id]/quyen-gop/page.tsx`, `.../donation-panel.tsx`
- `src/app/tra-cuu/page.tsx`, `src/app/huong-dan/page.tsx`, `src/app/403/page.tsx`
- `src/components/public-shell.tsx`, `src/components/progress-bar.tsx`
- `src/lib/public.ts`
- `docs/BACKEND-INTEGRATION-GUIDE.md`, `docs/reports/2026-11-15-task-5-giao-dien-cong-khai.md`
