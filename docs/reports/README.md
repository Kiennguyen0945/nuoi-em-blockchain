# Quy chuẩn báo cáo task (docs/reports/)

Mục đích: mỗi khi hoàn thành một thẻ Linear (task) trên dự án Nuoi-Em Blockchain, thành viên làm task phải tạo **1 file báo cáo** đặt trong thư mục này. Báo cáo là bằng chứng công việc cho nhóm: đọc cái là biết làm gì, để làm gì, kiểm chứng ra sao, quyết định nào đã chốt.

## Cách đặt tên file

```
docs/reports/YYYY-MM-DD-task-<số>-<slug-ngan-gon>.md
```

Ví dụ: `2026-11-10-task-2-database-5-accounts.md`

- Dùng dấu gạch ngang, không dấu tiếng Việt trong tên file
- `task-<số>`: số thứ tự thẻ Linear nếu biết, không rõ thì bỏ trống số, chỉ cần slug ngắn mô tả công việc
- Ngày = ngày hoàn thành task

## Nội dung bắt buộc (các mục)

1. **Header**: ngày, nhánh git, tên thẻ Linear (prefix giữ nguyên: `[CHORE]`, `[FEAT]`, `[DOCS]`)
2. **Những việc đã hoàn thành** — liệt kê cụ thể, kể cả việc "kiểm tra và giữ nguyên" (không đổi) chứ không chỉ việc tạo mới
3. **Mục đích của từng việc** — nêu rõ WHY (không chỉ WHAT)
4. **Quyết định đã chốt** — các lựa chọn kỹ thuật/nghiệp vụ quan trọng (vd: dùng `local_auth_id` làm "khu vực", L2 = childName+childImage)
5. **Cách kiểm chứng** — lệnh chạy lại được, truy vấn SQL, pass/fail của `tsc`, `lint`, `test`, `build`
6. **Việc còn lại / bàn giao** — việc task sau cần làm tiếp
7. **Tài khoản/dữ liệu demo** — nếu có (email, password, mã org code...)

## Ví dụ tham khảo

Xem `docs/reports/2026-11-10-task-2-database-5-accounts.md`

## Quy trình chung khi làm một task

1. Lấy thẻ trên Linear → copy tên nhánh → tạo nhánh từ `main` với prefix phù hợp (`chore/`, `feat/`, `fix/`, `docs/`, `refactor/`)
2. Code + bổ sung những gì còn thiếu → chạy kiểm tra: `npx tsc --noEmit`, `npm run lint`, `npm run test`, `npm run build`
3. Tạo file báo cáo trong `docs/reports/` theo quy chuẩn này
4. Commit ghi rõ prefix, push, tạo Pull Request → chờ CI xanh → merge
5. Xóa nhánh sau khi merge
