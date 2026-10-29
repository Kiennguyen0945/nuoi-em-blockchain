# Đặc tả chức năng MVP

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
| Chữ ký kép School + LocalAuth để chuyển sang `RECEIVING` | Cán bộ xã/phường hoặc giáo viên ngại đăng nhập hệ thống mới để "ký duyệt" | Chỉ LocalAuth ký, không cần School ký thêm |
| `SUSPENDED` và `REVOKED` | Quá nhiều nhánh rẽ (edge cases) cho việc gian lận | Cờ `IS_ACTIVE` (Boolean). Phát hiện gian lận thì Admin ẩn hồ sơ khỏi trang công khai và ghi lý do vào audit log |
| Versioning cho hồ sơ và báo cáo | Là tính năng của hệ thống CMS/ERP phức tạp | Cho phép sửa trực tiếp (overwrite), lưu thay đổi vào bảng `audit_logs` |
| Merkle Tree và batching | Là tư duy của hệ thống production có hàng triệu giao dịch | Ghi trực tiếp hash của từng bản ghi lên testnet hoặc L2 giá rẻ (Base, Polygon, Arbitrum) |
| Blockchain Writer là vai trò riêng | Không cần tách riêng | Gộp vào Backend Worker (cron job hoặc queue) |
| Người nhận tự tạo báo cáo và tải minh chứng | Đối tượng thụ hưởng thường không có kỹ năng dùng web/app | Wizard of Oz: Người nhận gửi ảnh hóa đơn qua Zalo cho Admin/Trường, Admin tải lên và gắn vào hồ sơ |

**Để sau MVP:** xem mục 10.

**Không triển khai trong phiên bản đầu tiên:** xem mục 11.

---

## 2. Phạm vi

### 2.1. Bao gồm

- Tạo hồ sơ hỗ trợ.
- Duyệt hồ sơ bởi bên có thẩm quyền.
- Nhận webhook giao dịch.
- Đối soát giao dịch.
- Ghi nhận chi tiêu và báo cáo (Admin nhập thay Người nhận).
- Trang công khai.
- Ghi hash lên blockchain.
- Nhật ký thay đổi và trạng thái.

---

## 3. Vai trò người dùng

| Vai trò | Quyền chính |
| --- | --- |
| Admin | Tạo hồ sơ, tiếp nhận giao dịch chưa khớp, nhập báo cáo và minh chứng thay Người nhận, ẩn hồ sơ, theo dõi hệ thống |
| School | Xem dữ liệu thuộc trường, gán giao dịch chưa khớp, xác nhận khoản quyên góp và báo cáo (theo quy tắc ở mục 6) |
| LocalAuth | Duyệt hồ sơ, xem dữ liệu thuộc địa phương, xác nhận khoản quyên góp và báo cáo |
| Người nhận | Gửi ảnh hóa đơn, minh chứng qua Zalo cho Admin/Trường (không thao tác trực tiếp trên hệ thống) |
| Mạnh thường quân | Xem thông tin công khai, tra cứu khoản quyên góp |

Việc ghi hash lên blockchain do Backend Worker thực hiện, không phải vai trò người dùng.

### Admin

- Được tạo và chỉnh sửa hồ sơ ở trạng thái `DRAFT`.
- Được gửi hồ sơ sang trạng thái `PENDING_APPROVAL`.
- Khi hồ sơ ở trạng thái `PENDING_APPROVAL`, Admin không được sửa trực tiếp.
- Nếu LocalAuth yêu cầu chỉnh sửa, hệ thống ghi nhận lý do và đưa hồ sơ về `DRAFT` để Admin sửa.
- Nhập báo cáo và minh chứng thay Người nhận.
- Được ẩn hồ sơ (`IS_ACTIVE = false`) và phải ghi lý do vào audit log.
- Không được tự ký hoặc tự duyệt hồ sơ.
- Sau khi hồ sơ được gửi duyệt, Admin không được xem dữ liệu off-chain cấp độ 2.
- Không được xóa hồ sơ hoặc audit log.

### School

- Chỉ được xem hồ sơ thuộc trường mình.
- Được gán giao dịch `UNMATCHED` vào hồ sơ.
- Được xác nhận khoản quyên góp và báo cáo theo quy tắc ở mục 6.
- Được ẩn hồ sơ khi phát hiện vấn đề, phải nhập lý do.

### LocalAuth

- Chỉ được xem hồ sơ thuộc địa phương mình.
- Được ký duyệt hồ sơ.
- Được từ chối hoặc yêu cầu chỉnh sửa hồ sơ. Khi yêu cầu chỉnh sửa, phải nhập lý do.
- Không được sửa trực tiếp hồ sơ đang chờ duyệt.
- Được xác nhận khoản quyên góp và báo cáo theo quy tắc ở mục 6.
- Được ẩn hồ sơ khi phát hiện vấn đề, phải nhập lý do.

### Quy tắc duyệt hồ sơ

- Hồ sơ chuyển sang `RECEIVING` khi LocalAuth ký duyệt.
- Nếu LocalAuth yêu cầu chỉnh sửa, hồ sơ không được chuyển sang `RECEIVING`.
- Mọi thay đổi hồ sơ ở trạng thái `DRAFT` được ghi vào `audit_logs`.

---

## 4. Các khái niệm chính

| Khái niệm | Mô tả |
| --- | --- |
| Hồ sơ hỗ trợ | Hồ sơ của một trẻ cần được hỗ trợ |
| Donation | Khoản tiền được chuyển vào tài khoản thụ hưởng |
| Reconciliation | Quá trình đối chiếu giao dịch với hồ sơ |
| Report | Báo cáo sử dụng tiền |
| Evidence | Minh chứng cho báo cáo |
| Commitment | Hash của dữ liệu được ghi nhận |
| On-chain record | Bằng chứng đã ghi trên blockchain |
| `audit_logs` | Bảng ghi lại ai sửa, sửa trường nào, giá trị cũ/mới, thời gian |

---

## 5. Luồng chức năng

### 5.1. Tạo hồ sơ

#### Điều kiện trước

- Admin đã đăng nhập.
- Admin có đủ thông tin hồ sơ.

#### Luồng chính

1. Admin nhập thông tin hồ sơ.
2. Hệ thống lưu hồ sơ ở trạng thái `DRAFT`.
3. Admin gửi hồ sơ để duyệt.
4. Hệ thống khóa dữ liệu hồ sơ (`PENDING_APPROVAL`).
5. LocalAuth xem phần dữ liệu được cấp quyền.
6. LocalAuth ký duyệt.
7. Hệ thống tạo commitment.
8. Backend Worker ghi commitment lên blockchain.
9. Hồ sơ chuyển sang trạng thái `RECEIVING`.

#### Luồng ngoại lệ

- LocalAuth từ chối hoặc yêu cầu chỉnh sửa.
- Hồ sơ thiếu dữ liệu.
- Commitment không ghi được lên blockchain.

#### Kết quả

- Hồ sơ có trạng thái mới.
- Có lịch sử hành động.
- Có commitment hoặc lý do thất bại.

---

### 5.2. Tiếp nhận giao dịch quyên góp

#### Luồng chính

1. Hệ thống nhận webhook giao dịch.
2. Kiểm tra mã tham chiếu.
3. Nếu khớp hồ sơ, tạo Donation.
4. Donation chuyển sang `RECONCILED`.
5. Các bên có thẩm quyền xác nhận.
6. Donation chuyển sang `CONFIRMED`.
7. Hệ thống phát hành biên nhận (có mã giao dịch ngân hàng và transaction hash).

#### Nếu không khớp mã

1. Tạo Donation ở trạng thái `UNMATCHED`.
2. Đưa vào danh sách chờ gán hồ sơ.
3. Admin hoặc School chọn hồ sơ phù hợp.
4. Ghi lại lý do và người thực hiện.
5. Donation chuyển sang `RECONCILED`.

#### Quy tắc

- Không được xóa giao dịch.
- Mọi thay đổi phải có audit log.
- Giao dịch sau thời điểm đóng nhận phải được đánh dấu `AFTER_CLOSING`.
- Một giao dịch không được gán cho nhiều hồ sơ.

---

### 5.3. Báo cáo sử dụng tiền

#### Luồng chính

1. Người nhận gửi ảnh hóa đơn, minh chứng qua Zalo cho Admin/Trường.
2. Admin tạo báo cáo trên hệ thống.
3. Nhập ngày, số tiền, hạng mục và mô tả.
4. Tải minh chứng và gắn vào hồ sơ.
5. Hệ thống tạo `evidence_root`.
6. Cơ quan có thẩm quyền xem và xác nhận.
7. Backend Worker ghi hash của báo cáo lên blockchain.
8. Báo cáo chuyển sang `REPORT_APPROVED`.

#### Quy tắc

- Không xóa báo cáo cũ.
- Báo cáo được sửa trực tiếp (overwrite), mọi thay đổi ghi vào `audit_logs`.
- Mạnh thường quân chỉ xem "báo cáo cuối cùng" và hash của báo cáo đó.
- Minh chứng nhạy cảm không được công khai.
- Hệ thống phải loại bỏ metadata ảnh trước khi lưu.

---

## 6. Mô hình trạng thái

### 6.1. Trạng thái hồ sơ

```text
DRAFT
  → PENDING_APPROVAL
  → RECEIVING
  → CLOSED
  → WAITING_FOR_REPORT
  → REPORT_SUBMITTED
  → REPORT_APPROVED

PENDING_APPROVAL
  → REVISION_REQUESTED
  → DRAFT

REPORT_SUBMITTED
  → REPORT_REVISION_REQUESTED
  → REPORT_SUBMITTED

WAITING_FOR_REPORT
  → OVERDUE
```

- `DRAFT`: Admin đang tạo hoặc chỉnh sửa hồ sơ.
- `PENDING_APPROVAL`: Hồ sơ đã khóa, chờ LocalAuth ký duyệt.
- `RECEIVING`: Hồ sơ bắt đầu nhận quyên góp.
- `CLOSED`: Hồ sơ đạt mục tiêu hoặc hết thời hạn nhận tiền.
- `WAITING_FOR_REPORT`: Đã đóng nhận và đang chờ báo cáo.
- `REPORT_SUBMITTED`: Admin đã nộp báo cáo và minh chứng (nhận từ Người nhận).
- `REPORT_APPROVED`: Báo cáo đã được các bên có thẩm quyền xác nhận.
- `OVERDUE`: Đã quá hạn nhưng chưa có báo cáo được xác nhận.

Điều kiện chuyển từ `REPORT_SUBMITTED` sang `REPORT_APPROVED`:

- Nếu tiền chuyển đến tài khoản người giám hộ: School và LocalAuth phải ký.
- Nếu tiền chuyển đến tài khoản trường: LocalAuth phải ký.

Khi báo cáo bị yêu cầu chỉnh sửa, Admin sửa trực tiếp báo cáo trên cùng hồ sơ, thay đổi được ghi vào `audit_logs`, sau đó gửi xác nhận lại.

#### Cờ `IS_ACTIVE`

`IS_ACTIVE` (Boolean) áp dụng cho mọi trạng thái có tác động thực tế: `RECEIVING`, `CLOSED`, `WAITING_FOR_REPORT`, `REPORT_SUBMITTED`, `REPORT_APPROVED`.

Khi Admin, School hoặc LocalAuth phát hiện vấn đề:

1. Nhập lý do bắt buộc.
2. Admin đặt `IS_ACTIVE = false`.
3. Hồ sơ bị ẩn khỏi trang công khai.
4. Không nhận khoản quyên góp mới.
5. Các giao dịch và báo cáo cũ vẫn được giữ nguyên.
6. Hệ thống ghi audit log.

Khi `IS_ACTIVE = false`:

- Không tạo khoản quyên góp mới cho hồ sơ.
- Giao dịch ngân hàng đến sau đó vẫn được ghi nhận, nhưng gắn cờ `AFTER_SUSPENSION`.
- Không chuyển hồ sơ sang `CLOSED` hoặc `WAITING_FOR_REPORT`.
- Không xóa giao dịch, báo cáo hoặc lịch sử.

---

### 6.2. Trạng thái khoản quyên góp

```text
PENDING_TRANSFER
  ├─→ RECONCILED
  │     └─→ CONFIRMED
  ├─→ UNMATCHED
  │     └─→ RECONCILED
  │           └─→ CONFIRMED
  └─→ EXPIRED
```

#### Người có thẩm quyền

- Tiền chuyển đến tài khoản người giám hộ: School và LocalAuth cùng xác nhận.
- Tiền chuyển đến tài khoản trường: LocalAuth xác nhận.

#### Trạng thái khoản quyên góp

- `PENDING_TRANSFER`: Hệ thống đã tạo yêu cầu quyên góp nhưng chưa nhận được webhook xác nhận tiền vào.
- `UNMATCHED`: Hệ thống đã nhận webhook tiền vào nhưng chưa xác định được hồ sơ hỗ trợ tương ứng.
- `RECONCILED`: Khoản tiền đã được ghép với một hồ sơ hỗ trợ.
- `CONFIRMED`: Khoản tiền đã được bên có thẩm quyền xác nhận.
- `EXPIRED`: Hết thời hạn chờ chuyển tiền nhưng không nhận được webhook tiền vào.

#### Quy tắc chuyển trạng thái

Khoản quyên góp không được quay lại trạng thái trước và không được xóa. Mọi thay đổi trạng thái phải tạo audit log.

| Chuyển trạng thái | Điều kiện | Thực hiện bởi |
| --- | --- | --- |
| `PENDING_TRANSFER → RECONCILED` | Webhook xác nhận tiền vào và mã tham chiếu khớp hồ sơ | Hệ thống |
| `PENDING_TRANSFER → UNMATCHED` | Webhook xác nhận tiền vào nhưng không tìm thấy mã tham chiếu hợp lệ | Hệ thống |
| `UNMATCHED → RECONCILED` | Gán giao dịch vào hồ sơ và ghi rõ lý do | Admin hoặc School |
| `RECONCILED → CONFIRMED` | Xác nhận khoản tiền | Người có thẩm quyền |
| `PENDING_TRANSFER → EXPIRED` | Hết thời hạn chờ chuyển nhưng không có tiền vào | Hệ thống tự động |

#### Commitment và blockchain

Hệ thống chỉ tạo commitment cho khoản quyên góp khi khoản đó chuyển sang `CONFIRMED`. Backend Worker ghi hash của từng bản ghi `CONFIRMED` lên testnet (hoặc L2 giá rẻ).

Dữ liệu dùng để tạo hash phải bao gồm tối thiểu:

- mã giao dịch nội bộ;
- số tiền;
- thời điểm nhận;
- mã hồ sơ;
- trạng thái `CONFIRMED`;
- các cờ bất thường có liên quan.

Nếu dữ liệu của giao dịch đã `CONFIRMED` cần thay đổi, hệ thống không sửa commitment cũ. Hệ thống tạo bản ghi điều chỉnh và ghi rõ lý do trong audit log.

Các quy tắc khi ghi lên blockchain:

- `PENDING_TRANSFER`: chưa ghi blockchain.
- `UNMATCHED`: chưa ghi blockchain.
- `RECONCILED`: chưa ghi blockchain.
- `CONFIRMED`: ghi hash lên blockchain.
- `EXPIRED`: không ghi blockchain.

#### Các cờ

- Nếu giao dịch không có mã tham chiếu và được Admin/School gán thủ công, gắn cờ `MANUALLY_ASSIGNED`.
- Nếu thời điểm tiền vào sau khi hồ sơ chuyển sang `CLOSED`, gắn cờ `RECEIVED_AFTER_CLOSING`.
- Nếu webhook đến sau khi yêu cầu đã `EXPIRED`, hệ thống không chuyển ngược trạng thái. Giao dịch được ghi nhận riêng, gắn cờ `RECEIVED_AFTER_EXPIRY`.
- Tổng tiền vượt mục tiêu được tính từ dữ liệu giao dịch, không lưu thành cờ.

### Giới hạn và điểm yếu của việc đối soát

Hệ thống không kiểm soát trực tiếp giao dịch ngân hàng. Hệ thống chỉ xử lý dựa trên dữ liệu nhận được từ webhook hoặc dữ liệu được nhập thủ công.

Vì vậy:

- Hệ thống không thể ngăn người dùng chuyển vượt số tiền mục tiêu.
- Hệ thống không thể đảm bảo mọi giao dịch đều có mã tham chiếu chính xác.
- Hệ thống không thể đảm bảo webhook đến ngay hoặc luôn đầy đủ.
- Hệ thống không thể xác định tuyệt đối giao dịch thuộc về hồ sơ nào nếu không có mã tham chiếu hoặc bằng chứng bổ sung.
- Hệ thống không thể ngăn giao dịch đến sau khi hồ sơ đã đóng.
- Hệ thống không thể đảm bảo phát hiện chính xác 100% giao dịch vượt mức, giao dịch quá hạn hoặc giao dịch đến sau khi hồ sơ đóng.
- Các giao dịch chuyển trực tiếp ngoài luồng VietQR có thể không được ghép tự động với hồ sơ.
- Webhook trùng, webhook đến trễ hoặc dữ liệu webhook sai có thể làm chậm hoặc gây khó khăn cho quá trình đối soát.

---

## 7. Phân loại dữ liệu

### On-chain

On-chain không lưu dữ liệu cá nhân. MVP chỉ ghi hash (commitment) của các bản ghi đã xác nhận. Trạng thái, chữ ký, thời gian nằm trong payload đã hash hoặc trong metadata off-chain liên kết với commitment.

### Off-chain công khai

- Mã hồ sơ.
- Tên trường.
- Tên địa phương.
- Tổng tiền đã xác nhận.
- Mục tiêu hỗ trợ.
- Trạng thái báo cáo.
- Các hạng mục chi đã công bố.

### Off-chain hạn chế

- Thông tin cá nhân của trẻ.
- Hồ sơ gốc.
- Hóa đơn có thông tin nhận diện.
- Ảnh có người hoặc nơi ở.
- Thông tin người yêu cầu đến thăm.

---

## 8. Quy tắc bất biến

- Không lưu dữ liệu cá nhân trực tiếp lên blockchain.
- Không xóa giao dịch đã ghi nhận.
- Không sửa trực tiếp hồ sơ sau khi đã gửi duyệt.
- Mọi thay đổi phải ghi vào `audit_logs` (ai sửa, trường nào, giá trị cũ/mới, thời gian).
- Một khoản quyên góp chỉ được xác nhận một lần.
- Chỉ giao dịch đã đối soát mới được tính vào tổng tiền công khai.
- Commitment phải có thể kiểm tra lại từ dữ liệu hợp lệ.
- Người xem công khai không được truy cập dữ liệu cấp độ 2.

---

## 9. Tiêu chí hoàn thành

Một chức năng được xem là hoàn thành khi:

- Có thể thực hiện luồng chính.
- Có xử lý lỗi cơ bản.
- Có phân quyền.
- Có audit log.
- Có test cho các trạng thái quan trọng.
- Có dữ liệu mẫu để demo.
- Có thể kiểm tra commitment/hash.

---

## 10. Để sau MVP

Các tính năng có giá trị, nhưng không cần để chứng minh core:

| Nhóm | Hạng mục |
| --- | --- |
| Mạnh thường quân | One-time link đến thăm; quy trình đăng ký chuyến thăm; log truy cập chi tiết cho từng one-time link; tài khoản người dùng cho mạnh thường quân |
| Tiền và đối soát | Xử lý hoàn tiền; quy tắc phân bổ tiền vượt mức; quyên góp định kỳ; hỗ trợ nhiều loại tiền tệ; theo dõi một khoản tiền xuyên suốt đến từng khoản chi; tích hợp ngân hàng hoặc MoMo thật |
| Blockchain | Trang block explorer riêng; hỗ trợ nhiều blockchain; Merkle batch tối ưu gas ở quy mô lớn; ví crypto và stablecoin; smart contract giữ tiền; cơ chế hoàn trả tự động; multi-signature ở cấp blockchain thay vì chữ ký nghiệp vụ |
| Vận hành và quản trị | Thông báo email, SMS hoặc push notification; dashboard phân tích nâng cao; cơ chế khiếu nại; blacklist; đường duyệt hồ sơ bằng "Minh chứng duyệt" do Admin upload (PDF/ảnh có dấu mộc xác nhận của địa phương), kèm cờ `APPROVED_VIA_EVIDENCE` trong commitment, hiển thị công khai khác với duyệt bằng chữ ký, và audit log ghi người upload cùng hash của file |
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
| Cho phép xóa giao dịch hoặc báo cáo cũ | Phá vỡ tính bất biến |
| Cho phép một tài khoản Admin vừa tạo hồ sơ vừa tự xác nhận | Xung đột lợi ích |
| Tự động xác minh một đứa trẻ là có thật bằng blockchain | Blockchain không làm được việc này |
| Cam kết rằng blockchain chứng minh tiền đã đến đúng người | Blockchain chỉ chứng minh dữ liệu không bị sửa |
| Theo dõi tiền của từng mạnh thường quân đến từng hóa đơn | Quá phức tạp, không cần để chứng minh core |

---

## 12. Điểm cần xác nhận

Hiện chưa có điểm nào còn mở.

### Đã chốt

- **Duyệt hồ sơ:** chỉ LocalAuth ký trên hệ thống. Đường Admin upload "Minh chứng duyệt" chuyển sang mục 10.
- **Xác nhận khoản quyên góp và báo cáo:** giữ nguyên quy tắc ở mục 6 (tài khoản người giám hộ cần School và LocalAuth; tài khoản trường cần LocalAuth).