# Đặc tả chức năng MVP

Bản hợp nhất: đã đưa các quyết định ở mục Bổ sung vào văn bản chính (vòng đời Donation, mã tham chiếu, xác nhận, tài khoản nhận tiền, ẩn/bật lại hồ sơ, phạm vi dữ liệu của Admin, báo cáo).

## 1. Mục tiêu

### 1.1. Vấn đề cần giải quyết

Mạnh thường quân chuyển tiền qua ngân hàng nhưng khó kiểm tra khoản tiền được ghi nhận cho hồ sơ nào, đã được xác nhận chưa và hồ sơ đó đã báo cáo việc sử dụng tiền hay chưa.

### 1.2. Mục tiêu của MVP

- Ghi nhận khoản quyên góp từ webhook giả lập.
- Ghép khoản quyên góp với hồ sơ trẻ.
- Theo dõi trạng thái đối soát và xác nhận.
- Công khai tiến độ thu và trạng thái báo cáo.
- Ghi bằng chứng bất biến lên blockchain.
- Không lưu dữ liệu cá nhân nhạy cảm on-chain.

### 1.3. Những điều MVP không giải quyết

**Không phải nền tảng giữ tiền hay pháp lý:**

- Không giữ tiền thật.
- Không xử lý chuyển đổi crypto/VND.
- Không hỗ trợ quyên góp định kỳ.
- Không phải nền tảng pháp lý hoặc tổ chức từ thiện.
- Không chứng minh tính chính xác của thông tin đầu vào nếu chưa có bên xác minh.

**Đơn giản hóa trong MVP (có làm, nhưng bản nhẹ hơn):**

| Hạng mục | Lý do cắt | Thay thế trong MVP |
| --- | --- | --- |
| Chữ ký kép School + LocalAuth (duyệt hồ sơ, xác nhận khoản quyên góp, duyệt báo cáo) | Cán bộ xã/phường hoặc giáo viên ngại đăng nhập hệ thống mới để "ký duyệt" | Chỉ LocalAuth ký, không cần School ký thêm |
| Tài khoản nhận tiền của người giám hộ (`GUARDIAN`) | MVP hướng đến trẻ em vùng cao và gia đình khó khăn; tiền chuyển qua nhà trường | Chỉ hỗ trợ tài khoản nhà trường (`SCHOOL`) |
| `SUSPENDED` và `REVOKED` | Quá nhiều nhánh rẽ (edge cases) cho việc gian lận | Cờ `IS_ACTIVE` (Boolean). School hoặc LocalAuth ẩn hồ sơ khỏi trang công khai và ghi lý do vào audit log; LocalAuth bật lại (mục 5.2) |
| Versioning cho hồ sơ và báo cáo | Là tính năng của hệ thống CMS/ERP phức tạp | Cho phép sửa trực tiếp (overwrite) khi đang ở trạng thái cho phép sửa, lưu thay đổi vào `audit_logs` |
| Merkle Tree và batching | Là tư duy của hệ thống production có hàng triệu giao dịch | Ghi trực tiếp hash của từng bản ghi lên testnet hoặc L2 giá rẻ (Base, Polygon, Arbitrum) |
| Blockchain Writer là vai trò riêng | Không cần tách riêng | Gộp vào Backend Worker (cron job hoặc queue) |
| Người nhận tự tạo báo cáo và tải minh chứng | Đối tượng thụ hưởng thường không có kỹ năng dùng web/app | Wizard of Oz: Người nhận gửi ảnh hóa đơn qua Zalo cho Admin/Trường, Admin tải lên và gắn vào hồ sơ |
| Tạo trước Donation khi phát sinh yêu cầu chuyển tiền | Tăng số trạng thái chờ và trạng thái hết hạn cho Donation | Donation chỉ được tạo sau khi nhận và xác thực webhook (mục 5.3, 5.4) |

**Để sau MVP:** xem mục 10.

**Không triển khai trong phiên bản đầu tiên:** xem mục 11.

---

## 2. Phạm vi

### 2.1. Bao gồm

- Tạo hồ sơ hỗ trợ.
- Duyệt hồ sơ bởi LocalAuth.
- Tạo mã VietQR và mã tham chiếu cho từng yêu cầu chuyển tiền.
- Nhận và xác thực webhook giao dịch, chống webhook trùng.
- Đối soát giao dịch và xác nhận khoản quyên góp.
- Ẩn hồ sơ và bật lại hồ sơ.
- Ghi nhận chi tiêu và báo cáo (Admin nhập thay Người nhận).
- Trang công khai.
- Ghi hash lên blockchain.
- Nhật ký thay đổi và trạng thái.

### 2.2. Quy tắc cố định trong MVP

- `recipient_account_type` luôn là `SCHOOL`. Không cho phép chọn `GUARDIAN`.
- Mọi khoản quyên góp chỉ cần LocalAuth xác nhận.
- Chỉ các Donation ở trạng thái `CONFIRMED` được tính vào tổng tiền công khai.

---

## 3. Vai trò và quyền

| Vai trò | Quyền chính |
| --- | --- |
| Admin | Tạo và sửa hồ sơ khi `DRAFT`, gửi duyệt, gán giao dịch chưa khớp, nhập báo cáo và minh chứng thay Người nhận, theo dõi hệ thống. Không được ẩn hồ sơ |
| School | Xem dữ liệu thuộc trường mình, gán giao dịch chưa khớp, ẩn hồ sơ thuộc trường mình, gửi yêu cầu bật lại. Không ký duyệt, không xác nhận |
| LocalAuth | Duyệt hồ sơ, xem dữ liệu thuộc địa phương mình, xác nhận hoặc từ chối khoản quyên góp, duyệt báo cáo, ẩn và bật lại hồ sơ, xử lý yêu cầu bật lại của School |
| Người nhận | Gửi ảnh hóa đơn, minh chứng qua Zalo cho Admin/Trường (không thao tác trực tiếp trên hệ thống) |
| Mạnh thường quân | Xem thông tin công khai, lấy mã VietQR, tra cứu khoản quyên góp |

Việc ghi hash lên blockchain do Backend Worker thực hiện, không phải vai trò người dùng.

### 3.1. Admin

- Tạo và chỉnh sửa hồ sơ ở trạng thái `DRAFT`, kể cả dữ liệu L2.
- Gửi hồ sơ sang `PENDING_APPROVAL`. Từ lúc này hồ sơ bị khóa: Admin chỉ xem được dữ liệu L1, không xem và không sửa dữ liệu L2.
- Nếu LocalAuth yêu cầu chỉnh sửa, hệ thống ghi lý do và đưa hồ sơ về `DRAFT` (qua `REVISION_REQUESTED`). Admin lại xem và sửa được dữ liệu L2, rồi gửi duyệt lại.
- Gán giao dịch `UNMATCHED` vào hồ sơ, phải ghi lý do.
- Nhập báo cáo và minh chứng thay Người nhận (mục 5.6).
- Hóa đơn là dữ liệu hạn chế: Admin tải lên được, nhưng sau khi lưu chỉ xem lại được bản đã che thông tin nhận diện.
- Không được ẩn hồ sơ, không được tự ký hoặc tự duyệt.
- Không được xóa hồ sơ, giao dịch hoặc audit log.

### 3.2. School

- Chỉ xem hồ sơ thuộc trường mình.
- Gán giao dịch `UNMATCHED` vào hồ sơ thuộc trường mình, phải ghi lý do.
- Ẩn hồ sơ thuộc trường mình, phải nhập lý do.
- Không tự bật lại được hồ sơ. School gửi yêu cầu bật lại kèm lý do, LocalAuth chấp nhận hoặc từ chối.
- Không ký duyệt hồ sơ, không xác nhận khoản quyên góp hay báo cáo.

### 3.3. LocalAuth

- Chỉ xem hồ sơ thuộc địa phương mình.
- Ký duyệt, từ chối hoặc yêu cầu chỉnh sửa hồ sơ. Khi yêu cầu chỉnh sửa hoặc từ chối phải nhập lý do.
- Không sửa trực tiếp hồ sơ đang chờ duyệt.
- Xác nhận hoặc từ chối khoản quyên góp (mục 5.5). Từ chối phải nhập lý do.
- Duyệt báo cáo hoặc yêu cầu chỉnh sửa báo cáo (mục 5.6).
- Ẩn hồ sơ thuộc địa phương mình, phải nhập lý do.
- Bật lại hồ sơ đang ẩn một cách tự do, kể cả hồ sơ do School ẩn hay do chính mình ẩn, không cần ai xác nhận thêm nhưng phải nhập lý do.
- Chấp nhận hoặc từ chối yêu cầu bật lại của School. Từ chối cũng phải ghi lý do.

### 3.4. Quy tắc duyệt hồ sơ

- Hồ sơ chuyển sang `RECEIVING` khi LocalAuth ký duyệt.
- Nếu LocalAuth yêu cầu chỉnh sửa, hồ sơ không được chuyển sang `RECEIVING`.
- Mọi thay đổi hồ sơ ở trạng thái `DRAFT` được ghi vào `audit_logs`.

### 3.5. Ma trận quyền

| Dữ liệu | Admin | School | LocalAuth | Mạnh thường quân |
| --- | --- | --- | --- | --- |
| Hồ sơ L2, khi `DRAFT` | Xem và sửa | Không | Không | Không |
| Hồ sơ L2, sau khi gửi duyệt | Không xem | Xem (trường mình) | Xem (địa phương mình) | Không |
| Hồ sơ L1 (gồm câu chuyện) | Xem | Xem | Xem | Xem |
| Mô tả và ảnh minh chứng, khi `REPORT_DRAFT` hoặc `REPORT_REVISION_REQUESTED` | Nhập, sửa, thay file | Không | Không | Không |
| Mô tả và ảnh minh chứng, sau khi gửi | Chỉ xem bản che của ảnh, không xem lại mô tả L2 | Xem (trường mình) | Xem (địa phương mình) | Không |
| Tổng tiền đã sử dụng | Nhập khi `REPORT_DRAFT` | Xem | Xem | Xem sau `REPORT_APPROVED` |

---

## 4. Các khái niệm chính và mô hình dữ liệu

| Khái niệm | Mô tả |
| --- | --- |
| Hồ sơ hỗ trợ (`cases`) | Hồ sơ của một trẻ cần được hỗ trợ. Có `recipient_account_id` và cờ `IS_ACTIVE` |
| Yêu cầu chuyển tiền (`transfer_requests`) | Mỗi lần tạo VietQR sinh một `reference_code` dùng một lần, có thời hạn. Chưa phải Donation |
| Donation | Khoản tiền đã phát sinh, được tạo sau khi nhận và xác thực webhook |
| Webhook (`webhook_events`) | Nhật ký mọi webhook nhận được và kết quả xử lý |
| Confirmation (`confirmations`) | Từng lần LocalAuth xác nhận hoặc từ chối một Donation hay báo cáo |
| Reconciliation | Quá trình đối chiếu giao dịch với hồ sơ |
| Report | Báo cáo sử dụng tiền |
| Evidence | Minh chứng cho báo cáo |
| Commitment | Hash của dữ liệu được ghi nhận |
| On-chain record | Bằng chứng đã ghi trên blockchain |
| `audit_logs` | Ai làm, vai trò, thời điểm, trường nào, giá trị cũ/mới, lý do |
| `reactivation_requests` | Yêu cầu bật lại hồ sơ của School |

### 4.1. Hai mã định danh cần phân biệt

| Mã | Vai trò |
| --- | --- |
| `reference_code` | Nằm trong nội dung chuyển khoản hoặc VietQR, dùng để tìm hồ sơ nhận tiền |
| `provider_transaction_id` | Mã giao dịch của nhà cung cấp, duy nhất, dùng chống webhook trùng |

Mã tham chiếu chỉ dùng một lần, mỗi yêu cầu chuyển tiền có một mã riêng:

```text
REF-001 → Donation → CASE-001
REF-002 → Donation → CASE-001
```

Một hồ sơ vẫn nhận được tiền từ nhiều người, nhưng mỗi Donation gắn với một mã tham chiếu riêng.

### 4.2. Trường chính của Donation

- Mã nội bộ, `provider_transaction_id` (unique), `reference_code` (nếu có).
- Số tiền, thời điểm tiền vào theo giờ ngân hàng trong webhook.
- Mã hồ sơ (rỗng khi `UNMATCHED`).
- `recipient_account_id` và thông tin tài khoản nhận tại thời điểm giao dịch.
- Trạng thái, các cờ, `transaction_hash` sau khi ghi on-chain.

---

## 5. Luồng chức năng

### 5.1. Tạo và duyệt hồ sơ

#### Điều kiện trước

- Admin đã đăng nhập và có đủ thông tin hồ sơ, kể cả tài khoản nhận tiền của nhà trường.

#### Luồng chính

1. Admin nhập thông tin hồ sơ (L1 và L2).
2. Hệ thống lưu hồ sơ ở trạng thái `DRAFT`.
3. Admin gửi hồ sơ để duyệt.
4. Hệ thống khóa dữ liệu hồ sơ (`PENDING_APPROVAL`). Admin chỉ còn xem được L1.
5. LocalAuth xem phần dữ liệu được cấp quyền.
6. LocalAuth ký duyệt.
7. Hệ thống tạo commitment.
8. Backend Worker ghi commitment lên blockchain.
9. Hồ sơ chuyển sang `RECEIVING`.

#### Luồng ngoại lệ

- LocalAuth yêu cầu chỉnh sửa: ghi lý do, hồ sơ sang `REVISION_REQUESTED` rồi về `DRAFT`.
- LocalAuth từ chối: hồ sơ sang `REJECTED`, ghi lý do.
- Hồ sơ thiếu dữ liệu.
- Commitment không ghi được lên blockchain: hồ sơ không sang `RECEIVING`, Worker thử lại và ghi lý do thất bại.

#### Kết quả

- Hồ sơ có trạng thái mới, có lịch sử hành động.
- Có commitment hoặc lý do thất bại.

### 5.2. Ẩn hồ sơ và bật lại hồ sơ

#### Ẩn hồ sơ

1. School (hồ sơ thuộc trường mình) hoặc LocalAuth (hồ sơ thuộc địa phương mình) nhập lý do bắt buộc.
2. Hệ thống đặt `IS_ACTIVE = false`, hồ sơ bị ẩn khỏi trang công khai.
3. Hồ sơ giữ nguyên trạng thái trước khi ẩn, chỉ cờ `IS_ACTIVE` đổi.
4. Hệ thống ghi audit log.

Admin không có quyền ẩn hồ sơ.

#### Bật lại hồ sơ

| Người thực hiện | Cách bật lại |
| --- | --- |
| LocalAuth | Bật lại trực tiếp, kể cả hồ sơ do School ẩn hay do chính mình ẩn. Phải nhập lý do, không cần ai xác nhận thêm |
| School | Không tự bật lại. Gửi yêu cầu bật lại kèm lý do. LocalAuth chấp nhận (hồ sơ bật lại) hoặc từ chối (phải ghi lý do) |

- Mỗi hồ sơ chỉ có một yêu cầu bật lại đang chờ tại một thời điểm.
- Khi bật lại, chỉ cờ `IS_ACTIVE` đổi về `true`.
- Các giao dịch đã gắn cờ `RECEIVED_AFTER_SUSPENSION` vẫn giữ cờ đó.
- Mọi thao tác ẩn, yêu cầu bật lại, chấp nhận, từ chối và bật lại đều ghi audit log gồm người làm, vai trò, thời điểm và lý do.

### 5.3. Tạo mã VietQR và mã tham chiếu

#### Điều kiện

- Hồ sơ ở `RECEIVING` và `IS_ACTIVE = true`.

#### Luồng chính

1. Mạnh thường quân chọn hồ sơ và yêu cầu mã chuyển tiền.
2. Hệ thống tạo `transfer_request` với `reference_code` duy nhất, dùng một lần, có thời hạn hiệu lực, kèm tài khoản nhận hiện hành của hồ sơ.
3. Hệ thống sinh VietQR chứa mã tham chiếu trong nội dung chuyển khoản.

#### Quy tắc

- Bước này **không** tạo Donation.
- Trạng thái của `transfer_request`: `PENDING`, `USED` (đã có webhook khớp), `EXPIRED` (hết hạn mà chưa có tiền vào).
- Hồ sơ `IS_ACTIVE = false` hoặc đã `CLOSED` không tạo yêu cầu chuyển tiền mới.

### 5.4. Tiếp nhận webhook và đối soát

#### Luồng xử lý

```text
Mạnh thường quân chuyển tiền
→ Hệ thống nhận webhook
→ Xác thực webhook (sai → từ chối, ghi webhook_events)
→ Kiểm tra provider_transaction_id
   ├─ Đã tồn tại → bỏ qua webhook trùng
   └─ Chưa tồn tại
       → Kiểm tra reference_code
          ├─ Khớp hồ sơ → tạo Donation ở RECONCILED
          └─ Không khớp → tạo Donation ở UNMATCHED

UNMATCHED
→ Admin hoặc School gán vào hồ sơ (ghi lý do)
→ RECONCILED
→ LocalAuth xác nhận
→ CONFIRMED
→ Tính vào tổng tiền công khai
```

#### Webhook khớp

- Tạo Donation ở `RECONCILED`, `transfer_request` chuyển sang `USED`.
- Hệ thống gắn cờ theo bảng cờ ở mục 6.3.

#### Webhook không khớp

- Không tìm thấy mã tham chiếu hợp lệ: tạo Donation mới ở `UNMATCHED`, đưa vào danh sách chờ gán.
- Admin hoặc School chọn hồ sơ phù hợp, ghi lý do và người thực hiện, Donation chuyển sang `RECONCILED` và gắn cờ `MANUALLY_ASSIGNED`.

#### Webhook trùng

Hệ thống dùng `provider_transaction_id` (ràng buộc unique) để nhận diện giao dịch đã tồn tại. Nếu nhận lại cùng mã:

- không tạo Donation mới;
- không cộng tiền lần nữa;
- giữ nguyên trạng thái Donation hiện có;
- ghi webhook là trùng hoặc đã xử lý.

#### Quy tắc

- Không được xóa giao dịch.
- Mọi thay đổi phải có audit log.
- Một giao dịch không được gán cho nhiều hồ sơ.
- Donation đã `RECONCILED` không được gán lại sang hồ sơ khác trong MVP.

### 5.5. Xác nhận khoản quyên góp

Vì `recipient_account_type` luôn là `SCHOOL`, chỉ LocalAuth xác nhận. Không cần chữ ký của School.

1. LocalAuth xem danh sách Donation `RECONCILED` thuộc địa phương mình.
2. LocalAuth xác nhận hoặc từ chối. Từ chối phải ghi lý do.
3. Hệ thống lưu một bản ghi trong `confirmations`: tên tài khoản người xác nhận, vai trò, thời điểm, kết quả (`APPROVED` hoặc `REJECTED`), lý do (nếu có).
4. Xác nhận: Donation sang `CONFIRMED`. Từ chối: Donation sang `REJECTED`.
5. Với `CONFIRMED`, hệ thống tạo commitment, Backend Worker ghi hash lên blockchain, rồi phát hành biên nhận (mã giao dịch ngân hàng và transaction hash).

Một khoản quyên góp chỉ được xác nhận hoặc từ chối một lần.

#### Tài khoản nhận tiền

- Hồ sơ được phép thay đổi tài khoản nhận tiền. Thay đổi chỉ áp dụng cho Donation phát sinh sau thời điểm cập nhật.
- Donation cũ lưu thông tin tài khoản tại thời điểm giao dịch (`recipient_account_id`) và không bị ảnh hưởng.
- Mọi thay đổi tài khoản phải có audit log.

### 5.6. Báo cáo sử dụng tiền

#### Luồng chính

1. Người nhận gửi ảnh hóa đơn, minh chứng qua Zalo cho Admin/Trường.
2. Khi báo cáo ở `REPORT_DRAFT`, Admin nhập tổng số tiền đã sử dụng, mô tả ngắn và tải ảnh minh chứng.
3. Hệ thống loại bỏ metadata ảnh, lưu bản gốc hạn chế và bản đã che. Sau khi lưu, Admin chỉ xem lại được bản đã che.
4. Hệ thống tạo `evidence_root`.
5. Admin gửi: báo cáo sang `REPORT_SUBMITTED` và bị khóa, Admin không sửa, không thay file.
6. LocalAuth xem và duyệt, hoặc yêu cầu chỉnh sửa kèm lý do.
7. Duyệt: Backend Worker ghi hash báo cáo lên blockchain, báo cáo sang `REPORT_APPROVED` và bị khóa hẳn.

#### Chỉnh sửa

- Nếu LocalAuth yêu cầu chỉnh sửa, báo cáo sang `REPORT_REVISION_REQUESTED`.
- Admin sửa trực tiếp và thay file, rồi gửi lại về `REPORT_SUBMITTED`.
- Nếu tải nhầm, Admin được thay file khi báo cáo chưa gửi xác nhận.
- Mọi lần sửa và thay file ghi vào `audit_logs` kèm hash file cũ và mới.

#### Quy tắc

- Không xóa báo cáo cũ.
- Công khai chỉ gồm **tổng số tiền đã sử dụng** (sau `REPORT_APPROVED`), trạng thái báo cáo và hash. Không công khai chi tiết từng khoản chi, mô tả hay ảnh.
- Minh chứng nhạy cảm không được công khai.
- Hệ thống phải loại bỏ metadata ảnh trước khi lưu.

---

## 6. Mô hình trạng thái

### 6.1. Trạng thái hồ sơ và báo cáo

```text
DRAFT
  → PENDING_APPROVAL
  → RECEIVING
  → CLOSED
  → WAITING_FOR_REPORT

PENDING_APPROVAL
  → REVISION_REQUESTED → DRAFT
  → REJECTED

Báo cáo (từ WAITING_FOR_REPORT trở đi):
WAITING_FOR_REPORT
  → REPORT_DRAFT
  → REPORT_SUBMITTED
  → REPORT_APPROVED

REPORT_SUBMITTED
  → REPORT_REVISION_REQUESTED
  → REPORT_SUBMITTED   (sau khi Admin sửa và gửi lại)

WAITING_FOR_REPORT
  → OVERDUE
  → REPORT_DRAFT       (vẫn được nộp sau hạn)
```

- `DRAFT`: Admin đang tạo hoặc chỉnh sửa hồ sơ, được sửa cả dữ liệu L2.
- `PENDING_APPROVAL`: hồ sơ đã khóa, chờ LocalAuth ký duyệt. Admin chỉ xem được L1.
- `REVISION_REQUESTED`: LocalAuth yêu cầu chỉnh sửa, đã ghi lý do, hồ sơ quay về `DRAFT`.
- `REJECTED`: LocalAuth từ chối hồ sơ.
- `RECEIVING`: hồ sơ bắt đầu nhận quyên góp.
- `CLOSED`: hồ sơ đạt mục tiêu hoặc hết thời hạn nhận tiền.
- `WAITING_FOR_REPORT`: đã đóng nhận và đang chờ báo cáo.
- `REPORT_DRAFT`: Admin đang nhập báo cáo và tải minh chứng.
- `REPORT_SUBMITTED`: Admin đã gửi báo cáo (nhận từ Người nhận). Báo cáo bị khóa.
- `REPORT_REVISION_REQUESTED`: LocalAuth yêu cầu chỉnh sửa. Admin được sửa trực tiếp và thay file.
- `REPORT_APPROVED`: LocalAuth đã duyệt, báo cáo bị khóa hẳn.
- `OVERDUE`: đã quá hạn nhưng chưa có báo cáo được duyệt.

Điều kiện chuyển `REPORT_SUBMITTED` sang `REPORT_APPROVED`: LocalAuth ký (tài khoản nhận tiền luôn là tài khoản trường). Mỗi lần ký hoặc yêu cầu chỉnh sửa được lưu vào `confirmations`.

### 6.2. Cờ `IS_ACTIVE`

`IS_ACTIVE` (Boolean) áp dụng cho mọi trạng thái có tác động thực tế: `RECEIVING`, `CLOSED`, `WAITING_FOR_REPORT` và các trạng thái báo cáo.

Quy trình ẩn và bật lại xem mục 5.2. Khi `IS_ACTIVE = false`:

- Hồ sơ bị ẩn khỏi trang công khai.
- Không tạo yêu cầu chuyển tiền (VietQR, mã tham chiếu) mới cho hồ sơ.
- Giao dịch ngân hàng đến sau đó vẫn được ghi nhận, nhưng gắn cờ `RECEIVED_AFTER_SUSPENSION`.
- Không chuyển hồ sơ sang `CLOSED` hoặc `WAITING_FOR_REPORT`.
- Không xóa giao dịch, báo cáo hoặc lịch sử.
- Hồ sơ giữ nguyên trạng thái trước khi ẩn. Khi bật lại chỉ cờ `IS_ACTIVE` đổi.

### 6.3. Trạng thái khoản quyên góp

MVP không tạo trước Donation ở `PENDING_TRANSFER`. Donation chỉ được tạo sau khi nhận và xác thực webhook, nên chỉ có bốn trạng thái:

```text
(webhook hợp lệ, chưa trùng)
  ├─→ RECONCILED ──┬─→ CONFIRMED
  │                └─→ REJECTED
  └─→ UNMATCHED ───→ RECONCILED ──┬─→ CONFIRMED
                                  └─→ REJECTED
```

- `UNMATCHED`: đã nhận webhook tiền vào nhưng chưa xác định được hồ sơ.
- `RECONCILED`: khoản tiền đã được ghép với một hồ sơ.
- `CONFIRMED`: LocalAuth đã xác nhận. Chỉ trạng thái này được tính vào tổng tiền công khai.
- `REJECTED`: LocalAuth từ chối khoản tiền (kèm lý do). Không tính vào tổng tiền công khai. Đây là trạng thái cuối trong MVP.

Hết thời hạn của yêu cầu chuyển tiền không phải trạng thái của Donation: nó là trạng thái `EXPIRED` của `transfer_request` (mục 5.3).

#### Quy tắc chuyển trạng thái

Khoản quyên góp không được quay lại trạng thái trước và không được xóa. Mọi thay đổi trạng thái phải tạo audit log.

| Chuyển trạng thái | Điều kiện | Thực hiện bởi |
| --- | --- | --- |
| (tạo mới) → `RECONCILED` | Webhook hợp lệ, chưa trùng, mã tham chiếu khớp hồ sơ | Hệ thống |
| (tạo mới) → `UNMATCHED` | Webhook hợp lệ, chưa trùng, không có mã tham chiếu hợp lệ | Hệ thống |
| `UNMATCHED → RECONCILED` | Gán vào hồ sơ, ghi rõ lý do | Admin hoặc School |
| `RECONCILED → CONFIRMED` | Xác nhận khoản tiền, lưu vào `confirmations` | LocalAuth |
| `RECONCILED → REJECTED` | Từ chối khoản tiền, ghi lý do, lưu vào `confirmations` | LocalAuth |

#### Cờ của Donation

| Cờ | Gắn khi nào | Gắn bởi |
| --- | --- | --- |
| `RECEIVED_AFTER_CLOSING` | Thời điểm tiền vào (theo giờ ngân hàng trong webhook) sau thời điểm hồ sơ sang `CLOSED` | Hệ thống, lúc đối soát |
| `RECEIVED_AFTER_SUSPENSION` | Thời điểm tiền vào nằm trong khoảng hồ sơ đang `IS_ACTIVE = false` | Hệ thống, lúc đối soát |
| `RECEIVED_AFTER_EXPIRY` | Webhook đến sau khi yêu cầu chuyển tiền đã `EXPIRED` | Hệ thống, lúc nhận webhook |
| `MANUALLY_ASSIGNED` | Giao dịch không có mã tham chiếu, được Admin hoặc School gán thủ công | Hệ thống, khi gán |

- Webhook đến sau khi yêu cầu đã `EXPIRED` không làm đổi ngược trạng thái. Giao dịch vẫn được ghi nhận và gắn cờ `RECEIVED_AFTER_EXPIRY`.
- Tổng tiền vượt mục tiêu được tính từ dữ liệu giao dịch, không lưu thành cờ.

#### Commitment và blockchain

Hệ thống chỉ tạo commitment cho Donation khi chuyển sang `CONFIRMED`. Backend Worker ghi hash của từng bản ghi `CONFIRMED` lên testnet (hoặc L2 giá rẻ).

Dữ liệu tạo hash tối thiểu gồm: mã giao dịch nội bộ, số tiền, thời điểm nhận, mã hồ sơ, trạng thái `CONFIRMED`, các cờ bất thường liên quan.

Nếu dữ liệu của giao dịch đã `CONFIRMED` cần thay đổi, hệ thống không sửa commitment cũ. Hệ thống tạo bản ghi điều chỉnh và ghi rõ lý do trong audit log.

| Trạng thái | Ghi blockchain |
| --- | --- |
| `UNMATCHED`, `RECONCILED`, `REJECTED` | Không |
| `CONFIRMED` | Có, ghi hash |

### 6.4. Giới hạn và điểm yếu của việc đối soát

Hệ thống không kiểm soát trực tiếp giao dịch ngân hàng. Hệ thống chỉ xử lý dựa trên dữ liệu nhận được từ webhook hoặc dữ liệu nhập thủ công. Vì vậy:

- Không thể ngăn người dùng chuyển vượt số tiền mục tiêu.
- Không thể đảm bảo mọi giao dịch đều có mã tham chiếu chính xác.
- Không thể đảm bảo webhook đến ngay hoặc luôn đầy đủ.
- Không thể xác định tuyệt đối giao dịch thuộc hồ sơ nào nếu không có mã tham chiếu hoặc bằng chứng bổ sung.
- Không thể ngăn giao dịch đến sau khi hồ sơ đã đóng.
- Không thể đảm bảo phát hiện chính xác 100% giao dịch vượt mức, quá hạn hoặc đến sau khi hồ sơ đóng.
- Giao dịch chuyển trực tiếp ngoài luồng VietQR có thể không được ghép tự động với hồ sơ.
- Webhook trùng, đến trễ hoặc sai dữ liệu có thể làm chậm hoặc gây khó khăn cho đối soát.

---

## 7. Phân loại dữ liệu

### On-chain

Không lưu dữ liệu cá nhân. MVP chỉ ghi hash (commitment) của các bản ghi đã xác nhận. Trạng thái, chữ ký, thời gian nằm trong payload đã hash hoặc trong metadata off-chain liên kết với commitment.

### Off-chain công khai (L1)

- Mã hồ sơ, tên trường, tên địa phương, mục tiêu hỗ trợ.
- Câu chuyện của hồ sơ.
- Tổng tiền đã xác nhận (chỉ Donation `CONFIRMED`).
- Trạng thái báo cáo và hash báo cáo.
- Tổng số tiền đã sử dụng, chỉ sau `REPORT_APPROVED`.

### Off-chain hạn chế (L2)

- Hồ sơ trẻ: tên trẻ, địa chỉ, tuổi, giới tính, ảnh trẻ, thông tin người giám hộ.
- Hồ sơ gốc.
- Hóa đơn có thông tin nhận diện (Admin chỉ xem lại bản đã che).
- Ảnh có người hoặc nơi ở.
- Mô tả ngắn việc sử dụng tiền và ảnh minh chứng. Không bao giờ công khai.
- Thông tin người yêu cầu đến thăm.

### Dữ liệu báo cáo

| Nội dung | Cấp | Ghi chú |
| --- | --- | --- |
| Tổng số tiền đã sử dụng | L2 khi nhập, L1 sau `REPORT_APPROVED` | Chỉ công khai sau khi được duyệt |
| Mô tả ngắn việc sử dụng | L2 | Không công khai |
| Ảnh minh chứng | L2 | Không công khai |

Mạnh thường quân chỉ thấy tổng tiền đã chi, trạng thái báo cáo và hash. Họ không thấy mô tả hay ảnh. Quy tắc này thay cho bản cũ có công khai hạng mục chi, số tiền và ngày của từng khoản chi.

---

## 8. Quy tắc bất biến

- Không lưu dữ liệu cá nhân trực tiếp lên blockchain.
- Không xóa giao dịch đã ghi nhận.
- Không sửa trực tiếp hồ sơ sau khi đã gửi duyệt.
- Không sửa báo cáo sau khi đã gửi xác nhận (trừ khi LocalAuth yêu cầu chỉnh sửa). Sau `REPORT_APPROVED` báo cáo bị khóa hẳn.
- Mọi thay đổi phải ghi vào `audit_logs` (ai sửa, vai trò, trường nào, giá trị cũ/mới, thời gian, lý do). Thay file kèm hash file cũ và mới.
- Một khoản quyên góp chỉ được xác nhận hoặc từ chối một lần.
- Webhook xử lý idempotent: một `provider_transaction_id` chỉ tạo tối đa một Donation.
- Chỉ Donation `CONFIRMED` được tính vào tổng tiền công khai. `UNMATCHED`, `RECONCILED`, `REJECTED` thì không.
- Donation lưu tài khoản nhận tại thời điểm giao dịch, đổi tài khoản của hồ sơ không ảnh hưởng Donation cũ.
- Commitment phải có thể kiểm tra lại từ dữ liệu hợp lệ.
- Người xem công khai không được truy cập dữ liệu L2.
- Admin không được ẩn hồ sơ. School chỉ ẩn hồ sơ trường mình, LocalAuth chỉ ẩn hồ sơ địa phương mình.

---

## 9. Tiêu chí hoàn thành

Một chức năng được xem là hoàn thành khi:

- Thực hiện được luồng chính.
- Có xử lý lỗi cơ bản.
- Có phân quyền.
- Có audit log.
- Có test cho các trạng thái quan trọng, tối thiểu: webhook khớp, webhook không khớp, webhook trùng, webhook đến sau `CLOSED`, sau `EXPIRED` và khi `IS_ACTIVE = false`, xác nhận và từ chối Donation, ẩn và bật lại hồ sơ (cả đường School gửi yêu cầu), đổi tài khoản nhận tiền, khóa dữ liệu L2 của Admin sau khi gửi duyệt, sửa và thay file báo cáo.
- Có dữ liệu mẫu để demo.
- Kiểm tra được commitment/hash.

---

## 10. Để sau MVP

Các tính năng có giá trị, nhưng không cần để chứng minh core:

| Nhóm | Hạng mục |
| --- | --- |
| Mạnh thường quân | One-time link đến thăm; quy trình đăng ký chuyến thăm; log truy cập chi tiết cho từng one-time link; tài khoản người dùng cho mạnh thường quân |
| Tiền và đối soát | Tài khoản nhận tiền của người giám hộ (`GUARDIAN`) kèm quy tắc School và LocalAuth cùng xác nhận; xử lý hoàn tiền (kể cả với Donation `REJECTED`); quy tắc phân bổ tiền vượt mức; quyên góp định kỳ; nhiều loại tiền tệ; theo dõi một khoản tiền xuyên suốt đến từng khoản chi; công khai chi tiết từng khoản chi; tích hợp ngân hàng hoặc MoMo thật |
| Blockchain | Trang block explorer riêng; nhiều blockchain; Merkle batch tối ưu gas; ví crypto và stablecoin; smart contract giữ tiền; cơ chế hoàn trả tự động; multi-signature ở cấp blockchain |
| Vận hành và quản trị | Thông báo email, SMS, push; dashboard phân tích nâng cao; cơ chế khiếu nại; blacklist; đường duyệt hồ sơ bằng "Minh chứng duyệt" do Admin upload (PDF/ảnh có dấu mộc xác nhận của địa phương), kèm cờ `APPROVED_VIA_EVIDENCE` trong commitment, hiển thị công khai khác với duyệt bằng chữ ký, audit log ghi người upload cùng hash của file |
| Kỹ thuật khác | Tự động loại bỏ metadata ảnh nâng cao; ứng dụng mobile; Người nhận tự nộp báo cáo; versioning hồ sơ và báo cáo; luồng đình chỉ/thu hồi nhiều bước |

---

## 11. Không triển khai trong phiên bản đầu tiên

Các phần này dễ làm dự án phức tạp hoặc tạo rủi ro lớn:

| Hạng mục | Rủi ro chính |
| --- | --- |
| Giữ tiền thật trong smart contract | Rủi ro tài chính và pháp lý |
| Tự động quy đổi USDT/token sang VND | Rủi ro tài chính và pháp lý |
| Tích hợp thanh toán thật trước khi hoàn thiện cơ chế đối soát | Chưa kiểm soát được đối soát |
| Cho phép hệ thống tự quyết định tiền vượt mức chuyển cho ai | Quyết định nghiệp vụ nhạy cảm, cần con người |
| Đưa tên, tuổi, giới tính, câu chuyện hoặc ảnh trẻ lên blockchain | Lộ dữ liệu cá nhân, không thể xóa |
| Cho phép Admin sửa hồ sơ sau khi đã gửi duyệt | Phá vỡ độ tin cậy của việc duyệt |
| Cho phép Admin ẩn hồ sơ | Quyền ẩn thuộc về School và LocalAuth, tránh Admin đơn phương gỡ hồ sơ |
| Cho phép xóa giao dịch hoặc báo cáo cũ | Phá vỡ tính bất biến |
| Cho phép một tài khoản Admin vừa tạo hồ sơ vừa tự xác nhận | Xung đột lợi ích |
| Tự động xác minh một đứa trẻ là có thật bằng blockchain | Blockchain không làm được việc này |
| Cam kết rằng blockchain chứng minh tiền đã đến đúng người | Blockchain chỉ chứng minh dữ liệu không bị sửa |
| Theo dõi tiền của từng mạnh thường quân đến từng hóa đơn | Quá phức tạp, không cần để chứng minh core |

---

## 12. Điểm cần xác nhận

### Đã chốt

- **Duyệt hồ sơ:** chỉ LocalAuth ký trên hệ thống. Đường Admin upload "Minh chứng duyệt" chuyển sang mục 10.
- **Tài khoản nhận tiền:** chỉ `SCHOOL`. `GUARDIAN` chuyển sang mục 10.
- **Xác nhận khoản quyên góp và duyệt báo cáo:** chỉ LocalAuth. Ghi `confirmations` gồm tên tài khoản, thời điểm, kết quả. Bên từ chối đưa Donation sang `REJECTED`.
- **Donation:** chỉ tạo sau webhook hợp lệ. Chống trùng bằng `provider_transaction_id`.
- **Ẩn và bật lại hồ sơ:** School và LocalAuth được ẩn trong phạm vi mình, Admin không. LocalAuth bật lại tự do, School phải gửi yêu cầu.
- **Báo cáo:** công khai chỉ tổng số tiền đã sử dụng, sau `REPORT_APPROVED`. Chấp nhận trạng thái `REPORT_DRAFT`.

### Giả định đã áp dụng khi hợp nhất, cần bạn kiểm tra

1. **Đổi tài khoản nhận tiền:** bản Bổ sung cho phép đổi nhưng chưa nói ai được đổi sau khi hồ sơ đã gửi duyệt (Admin bị khóa). Cần chốt người thực hiện và có cần LocalAuth xác nhận không. VietQR còn hiệu lực với tài khoản cũ cũng cần quy tắc.
2. **Mã tham chiếu hết hạn:** tôi thêm thực thể `transfer_request` với trạng thái `PENDING`, `USED`, `EXPIRED` để giữ được cờ `RECEIVED_AFTER_EXPIRY` khi Donation không còn `EXPIRED`. Cần chốt thời hạn hiệu lực mặc định, và hạn nộp báo cáo (`OVERDUE`).
3. **Mã tham chiếu đã dùng:** nếu webhook mới (khác `provider_transaction_id`) mang mã đã `USED`, hiện xử lý như không có mã hợp lệ, tạo `UNMATCHED`.
4. **Tài khoản nhận của giao dịch gán thủ công:** lấy theo tài khoản hiện hành của hồ sơ lúc gán và ghi audit log.
5. **Donation `REJECTED`:** là trạng thái cuối, việc xử lý tiền thực tế nằm ngoài hệ thống (hoàn tiền ở mục 10).
6. **Câu chuyện công khai (L1):** nên được viết ẩn danh, không chứa thông tin L2.



1. Bảo mật webhook

Nhà cung cấp gửi kèm chữ ký HMAC-SHA256 tính trên nội dung gốc của request, dùng một khóa bí mật dùng chung. Hệ thống tính lại và so sánh. Sai chữ ký thì từ chối và ghi vào webhook_events với trạng thái INVALID.
Thêm một header thời gian và từ chối request cũ hơn khoảng 5 phút, để người ngoài không phát lại được một request đã bị lộ.
Chống trùng dùng ràng buộc unique trên provider_transaction_id ở tầng cơ sở dữ liệu, không chỉ kiểm tra trong code. Như vậy hai webhook đến cùng lúc vẫn chỉ tạo một Donation.

2. Công cụ giả lập webhook
Làm một script dòng lệnh hoặc một trang nhỏ chỉ Admin dùng, chỉ bật ở môi trường demo. Script ký request bằng đúng khóa trên và gọi đúng endpoint thật, không đi đường tắt vào cơ sở dữ liệu. Có sẵn bốn kịch bản bấm là chạy: khớp mã, không khớp mã, gửi lại cùng provider_transaction_id, và tiền vào sau CLOSED. Bắt đầu bằng script dòng lệnh là rẻ nhất, trang web để sau nếu cần.

3. Tài khoản và phạm vi dữ liệu

Tạo bảng schools (mỗi trường thuộc đúng một địa phương) và local_authorities. Mỗi case chỉ lưu school_id, địa phương suy ra qua trường.
Mỗi tài khoản School gắn với một trường, mỗi tài khoản LocalAuth gắn với một địa phương, Admin không bị giới hạn. Kiểm tra quyền chỉ là so phạm vi của người dùng với phạm vi của hồ sơ.
Tạo tài khoản bằng seed, khoảng 1 Admin, 2 trường, 1 đến 2 địa phương là đủ để demo cả quy tắc “chỉ xem hồ sơ của mình”.

4. Trang kiểm tra hash công khai
Một trang nhập mã tham chiếu hoặc transaction hash. Trang hiển thị dữ liệu công khai đã dùng để băm, tính lại hash bằng quy tắc ở mục 6, rồi so với giá trị đọc từ blockchain. Kết quả có ba loại: khớp, không khớp, chưa ghi lên blockchain. Với tra cứu giao dịch thì dẫn link sang block explorer bên ngoài, không phải làm trang explorer riêng.

5. Tra cứu biên nhận
Tra bằng reference_code, đừng tra bằng mã giao dịch ngân hàng. Mạnh thường quân đã có sẵn mã này từ lúc quét VietQR nên không cần thêm mã nào khác. Hai điều cần sửa theo:

Ví dụ REF-001 trong spec là mã tuần tự nên có thể đoán được. Đổi thành mã ngẫu nhiên khoảng 10 đến 12 ký tự chữ và số, bỏ ký tự dễ nhầm.
Chỉ dùng chữ và số, không dấu gạch, vì ngân hàng thường tự bỏ ký tự đặc biệt trong nội dung chuyển khoản. Khi ghép mã, tìm mã trong nội dung chuyển khoản không phân biệt hoa thường.

Trang tra cứu chỉ hiện số tiền, thời điểm, mã hồ sơ, trạng thái, cờ, hash và transaction hash. Không hiện tên người chuyển, số tài khoản hay mã giao dịch ngân hàng. Lưu ý là giao dịch UNMATCHED chưa có mã hợp lệ nên chưa tra được cho đến khi được gán, thế là chấp nhận được trong MVP.

6. Quy tắc serialize trước khi hash
Đừng tự nghĩ ra quy tắc, dùng chuẩn JSON Canonicalization Scheme (RFC 8785) và ghi vào spec các điểm sau:

Mã hóa UTF-8, khóa sắp xếp theo thứ tự chữ cái, không khoảng trắng thừa.
Số tiền là số nguyên VND, không dùng số thực. Thời gian là ISO 8601 theo UTC, định dạng cố định.
Mảng cờ được sắp xếp. Bỏ các trường rỗng. Thêm schema_version và type (ví dụ donation, report, case) vào payload.
Hash bằng SHA-256, ghi 32 byte lên blockchain.
Cùng một hàm dùng cho Worker lúc ghi và trang kiểm tra lúc xác minh, kèm một test với dữ liệu cố định và hash đã biết trước.

Về che hóa đơn, thu nhỏ rồi làm mờ nghe gọn và làm được hoàn toàn tự động, không cần Admin tô vùng nào. Có hai lưu ý:

Làm mờ toàn bộ ảnh với độ mạnh đủ để không đọc được chữ, và kiểm tra bằng vài ảnh thật trước khi chốt. Bản che chỉ để Admin thấy “đã tải đúng file”.
Bản gốc lưu ở vùng dữ liệu hạn chế, chỉ School và LocalAuth xem được.

Hạn nộp báo cáo 30 ngày thì tôi đề xuất tính từ lúc hồ sơ sang WAITING_FOR_REPORT, và để thành một giá trị cấu hình. Hiệu lực của mã tham chiếu là 24 giờ đủ cho một lần quét QR và chuyển khoản, và cũng để cấu hình được.