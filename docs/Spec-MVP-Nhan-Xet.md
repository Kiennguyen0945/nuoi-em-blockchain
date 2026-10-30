
**Mâu thuẫn cần sửa**

1. **Vòng đời Donation không khớp với luồng 5.2.**
   - Mục 6.2 bắt đầu từ `PENDING_TRANSFER` ("hệ thống đã tạo yêu cầu quyên góp"), nhưng mục 5.2 lại tạo Donation khi nhận webhook.
   - Chức năng tạo yêu cầu quyên góp (sinh mã tham chiếu và VietQR) không có trong phạm vi hay luồng nào.
   - `PENDING_TRANSFER → UNMATCHED` cũng vô lý, vì webhook không có mã thì không có bản ghi PENDING nào để chuyển.
   - Đề xuất:
     - Thêm luồng "Tạo yêu cầu quyên góp".
     - Webhook không khớp thì tạo thẳng Donation ở `UNMATCHED`.
2. **Tổng tiền công khai tính theo trạ thái nào.**
   - Mục 8 nói "chỉ giao dịch đã đối soát" (`RECONCILED`) được tính vào tổng.
   - Mục 7 lại công khai "tổng tiền đã xác nhận" (`CONFIRMED`).
   - Đề xuất: hiển thị hai con số, "đã xác nhận" là chính và "đang chờ xác nhận" là phụ. Cần chốt một quy tắc.
3. **Hai bên cùng ký so với "chỉ xác nhận một lần".**
   - Với tài khoản người giám hộ, cần cả School và LocalAuth ký, nhưng mô hình chỉ có một trạng thái `CONFIRMED`.
   - Đề xuất: thêm bảng `confirmations` (ai ký, lúc nào). Chỉ khi đủ chữ ký mới chuyển `CONFIRMED`.
   - Cần thêm trường `recipient_account_type` (GUARDIAN/SCHOOL) vào hồ sơ. Hiện nó chưa có trong đặc tả.
4. **Ai được đặt `IS_ACTIVE = false`.** Mục 3 cho School và LocalAuth "ẩn hồ sơ", nhưng mục 6.1 ghi "Admin đặt". Đề xuất: cả ba vai trò đều được, bắt buộc nhập lý do. Cũng cần định nghĩa đường bật lại.
5. **Tên cờ không thống nhất.** Cùng một ý nhưng có `AFTER_CLOSING` và `RECEIVED_AFTER_CLOSING`, cùng với `AFTER_SUSPENSION`. Nên chốt một danh sách cờ chuẩn.ng
6. **"Dữ liệu off-chain cấp độ 2" chưa được định nghĩa.** Mục 7 chỉ có "công khai" và "hạn chế". Nên đặt tên rõ là L1 (công khai) và L2 (hạn chế). Admin cần xem hóa đơn để nhập báo cáo, nên cần làm rõ L2 gồm những gì và Admin bị chặn phần nào.
7. **Ghi blockchain đang chặn nghiệp vụ.**
   - Mục 5.1 chỉ chuyển hồ sơ sang `RECEIVING` sau khi ghi chain xong. Testnet chậm hoặc lỗi thì hồ sơ kẹt.
   - Đề xuất: duyệt xong chuyển `RECEIVING` ngay, còn commitment ghi bất đồng bộ với trạng thái riêng (`PENDING/SUBMITTED/FAILED`) và retry.
8. **Thiếu trạng thái hoặc luồng.**
   - `LocalAuth` "từ chối" chưa có trạng thái, ví dụ `REJECTED`.
   - Thiếu `OVERDUE → REPORT_SUBMITTED`.
   - Thiếu hạn nộp báo cáo (`report_deadline`) và điều kiện đóng hồ sơ (`target_amount`, `closing_date`).
   - `CLOSED` và `WAITING_FOR_REPORT` gần như trùng nhau.
9. **Báo cáo sửa trực tiếp nhưng hash đã lên chain.**
   - Chưa rõ sau `REPORT_APPROVED` có được sửa không. Nếu có, hash cũ sẽ sai.
   - Đề xuất: khóa sau khi approved. Cần sửa thì tạo bản ghi điều chỉnh như Donation.
   - `evidence_root` cũng cần định nghĩa. Vì không dùng Merkle, có thể là hash của danh sách hash file đã sắp xếp.
10. **Còn sót "aa"** ở cuối tài liệu. Mục 12 cũng nên bỏ hoặc gộp vào "Đã chốt".

**Thiếu hẳn (nên thêm vào phạm vi)**

- **Bảo mật webhook:** xác thực chữ ký (HMAC), chống trùng lặp theo mã giao dịch ngân hàng (idempotency). Đặc tả mới chỉ nhắc đây là điểm yếu.
- **Công cụ giả lập webhook:** MVP dùng "webhook giả lập" nên cần một công cụ để demo.
- **Quản lý tài khoản và phạm vi dữ liệu:** quan hệ hồ sơ với School và LocalAuth, cùng cách tạo tài khoản (seed là đủ cho MVP).
- **Trang kiểm tra hash công khai:** tiêu chí hoàn thành yêu cầu "kiểm tra được commitment/hash".
- **Tra cứu biên nhận:** mạnh thường quân tra bằng gì (mã biên nhận hoặc mã giao dịch)? Cần chọn cách không lộ thông tin người khác.
- **Quy tắc serialize trước khi hash (canonical JSON):** thiếu thì không thể kiểm tra lại hash.
