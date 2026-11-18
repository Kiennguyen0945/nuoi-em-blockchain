# Báo cáo - Truy vấn hồ sơ công khai bằng mã (/tra-cuu-ho-so)

- **Ngày:** 2026-11-18
- **Nhánh:** `feat/trinhbinhkhangit/tra-cuu-ho-so`
- **PR:** #37
- **Mục tiêu:** Cho phép MTQ tra cứu hồ sơ theo mã thay vì cuộn danh sách dài

## 1. Những việc đã hoàn thành

1. **`src/lib/public-lookup.ts`** — hàm thuần:
   - `normalizeLookupQuery(q)`: bỏ chữ HS, bỏ gạch/dấu cách, uppercase
   - `recordMatchesQuery(record, q)`: match theo phần đầu UUID (đã bỏ gạch) hoặc từ khóa hoàn cảnh
2. **`GET /api/public/lookup?q=`** — công khai, không yêu cầu auth: lọc `RECEIVING/WAITING_FOR_REPORT`, trả L1 (mã rút gọn, hoàn cảnh, trường/xã, tiến độ, số donation)
3. **`/tra-cuu-ho-so`** — ô nhập mã, kết quả hiển thị card, bấm vào → `/ho-so/[id]` (giống hệt click hồ sơ đó trên danh sách)
4. **Nav** trên `PublicShell` thêm "Tra cứu hồ sơ"
5. **Unit tests** `test/unit/public-lookup.test.ts` — normalize + match theo UUID/từ khóa/hoa thường/dấu gạch ngắn

## 2. Mục đích

- Quản lý nhiều hồ sơ dễ dàng khi dự án mở rộng — không phải cuộn lưới từng trường
- MTQ thấy ngay hồ sơ cần → bấm trực tiếp vào trang sao kê
- L1 công khai, L2 ẩn hoàn toàn (không bao giờ trả childName/childImage qua API)

## 3. Quyết định đã chốt

- Match theo **5–8 ký tự đầu của UUID** (prefix) + hoàn cảnh; không làm full-text search/fuzzy
- Không tự động gọi `/ho-so/[id]` — người dùng phải bấm vào kết quả (tránh lộ id)
- Chỉ hiện hồ sơ REceiving/Waiting (đúng như trang sao kê công khai)

## 4. Cách kiểm chứng

```powershell
npm run build   # pass
npm run test:unit  # 39 test pass
```

Mở http://localhost:3000/tra-cuu-ho-so → nhập mã (vd `7a46b131`) → ra kết quả.

## 5. Kết quả kiểm tra chất lượng

- `npx tsc --noEmit` — exit 0
- `npm run lint` — ✓ No ESLint warnings
- `npm run build` — ✓ 18 routes (thêm `/tra-cuu-ho-so`)
- `npm run test:unit` — **39 pass / 0 fail** (bao gồm 4 test mới)
- Server check: `/api/public/lookup?q=Hộ nghèo` → 1 record, `?q=7a46b131` → 1 record, `?q=zzzz` → rỗng

## 6. Việc còn lại/bàn giao

- Có thể thêm gợi ý (autocomplete) khi nhập — sau MVP.
- Khi DB có nhiều hồ sơ, nên thêm index trên `records` hoặc chuyển sang `tsquery`.
