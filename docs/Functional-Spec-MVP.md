
```md
# Đặc tả chức năng MVP

## 1. Mục tiêu

### 1.1. Vấn đề cần giải quyết

Mô tả ngắn vấn đề hệ thống giải quyết.

Ví dụ:

Mạnh thường quân chuyển tiền qua ngân hàng nhưng khó kiểm tra khoản tiền
được ghi nhận cho hồ sơ nào, đã được xác nhận chưa và hồ sơ đó đã báo cáo
việc sử dụng tiền hay chưa.

### 1.2. Mục tiêu của MVP

- Ghi nhận khoản quyên góp từ webhook giả lập.
- Ghép khoản quyên góp với hồ sơ trẻ.
- Theo dõi trạng thái đối soát và xác nhận.
- Công khai tiến độ thu và trạng thái báo cáo.
- Ghi bằng chứng bất biến lên blockchain.
- Không lưu dữ liệu cá nhân nhạy cảm on-chain.

### 1.3. Những điều MVP không giải quyết

- Không giữ tiền thật.
- Không xử lý chuyển đổi crypto/VND.
- Không hỗ trợ quyên góp định kỳ.
- Không phải nền tảng pháp lý hoặc tổ chức từ thiện.
- Không chứng minh tính chính xác của thông tin đầu vào nếu chưa có bên xác minh.

---

## 2. Phạm vi

### 2.1. Bao gồm

- Tạo hồ sơ hỗ trợ.
- Xác nhận hồ sơ bởi các bên có thẩm quyền.
- Nhận webhook giao dịch.
- Đối soát giao dịch.
- Ghi nhận chi tiêu và báo cáo.
- Trang công khai.
- Ghi hash/commitment lên blockchain.
- Nhật ký thay đổi và trạng thái.


## 3. Vai trò người dùng

| Vai trò | Quyền chính |
|---|---|
| Admin | Tạo hồ sơ, tiếp nhận giao dịch chưa khớp, theo dõi hệ thống |
| School | Xác nhận hồ sơ, xem dữ liệu thuộc trường |
| LocalAuth | Xác nhận hồ sơ, xem dữ liệu thuộc địa phương |
| Người nhận | Nộp minh chứng và báo cáo |
| Mạnh thường quân | Xem thông tin công khai, tra cứu khoản quyên góp |
| Blockchain Writer | Ghi commitment và Merkle root lên blockchain |


### Admin

- Được tạo và chỉnh sửa hồ sơ ở trạng thái `DRAFT`.
- Được gửi hồ sơ sang trạng thái `PENDING_APPROVAL`.
- Khi hồ sơ ở trạng thái `PENDING_APPROVAL`, Admin không được sửa trực tiếp.
- Nếu School hoặc LocalAuth yêu cầu chỉnh sửa, hệ thống ghi nhận lý do.
- Admin tạo một phiên bản hồ sơ mới để chỉnh sửa.
- Không được tự ký hoặc tự duyệt hồ sơ.
- Sau khi hồ sơ được gửi duyệt, Admin không được xem dữ liệu off-chain cấp độ 2.
- Không được xóa hồ sơ hoặc lịch sử phiên bản.

### School

- Chỉ được xem hồ sơ thuộc trường mình.
- Được ký hồ sơ.
- Được từ chối hoặc yêu cầu chỉnh sửa hồ sơ.
- Khi yêu cầu chỉnh sửa, phải nhập lý do.
- Không được sửa trực tiếp hồ sơ đang chờ duyệt.

### LocalAuth

- Chỉ được xem hồ sơ thuộc địa phương mình.
- Được ký hồ sơ.
- Được từ chối hoặc yêu cầu chỉnh sửa hồ sơ.
- Khi yêu cầu chỉnh sửa, phải nhập lý do.
- Không được sửa trực tiếp hồ sơ đang chờ duyệt.

### Quy tắc xác nhận

- Hồ sơ chuyển sang `RECEIVING` khi School và LocalAuth cùng ký đúng một phiên bản.
- Nếu một bên yêu cầu chỉnh sửa, hồ sơ không được chuyển sang `RECEIVING`.
- Mỗi phiên bản có số phiên bản, thời gian tạo và người tạo.
- Chữ ký của phiên bản cũ không có hiệu lực với phiên bản mới.

---

## 4. Các khái niệm chính

| Khái niệm | Mô tả |
|---|---|
| Hồ sơ hỗ trợ | Hồ sơ của một trẻ cần được hỗ trợ |
| Donation | Khoản tiền được chuyển vào tài khoản thụ hưởng |
| Reconciliation | Quá trình đối chiếu giao dịch với hồ sơ |
| Report | Báo cáo sử dụng tiền |
| Evidence | Minh chứng cho báo cáo |
| Commitment | Hash của dữ liệu được ghi nhận |
| On-chain record | Bằng chứng đã ghi trên blockchain |

---

## 5. Luồng chức năng

### 5.1. Tạo hồ sơ

#### Điều kiện trước

- Admin đã đăng nhập.
- Admin có đủ thông tin hồ sơ.

#### Luồng chính

1. Admin nhập thông tin hồ sơ.
2. Hệ thống lưu hồ sơ ở trạng thái `DRAFT`.
3. Admin gửi hồ sơ để xác nhận.
4. Hệ thống khóa dữ liệu hồ sơ.
5. School và LocalAuth xem phần dữ liệu được cấp quyền.
6. Hai bên ký xác nhận.
7. Hệ thống tạo commitment.
8. Hệ thống ghi commitment lên blockchain.
9. Hồ sơ chuyển sang trạng thái `RECEIVING`.

#### Luồng ngoại lệ

- Một bên từ chối xác nhận.
- Hồ sơ thiếu dữ liệu.
- Commitment không ghi được lên blockchain.
- Người gửi yêu cầu chỉnh sửa sau khi hồ sơ đã được xác nhận.

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
7. Hệ thống phát hành biên nhận.

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

1. Người nhận tạo báo cáo.
2. Nhập ngày, số tiền, hạng mục và mô tả.
3. Tải minh chứng.
4. Hệ thống tạo `evidence_root`.
5. Cơ quan có thẩm quyền xem và xác nhận.
6. Hệ thống ghi commitment của báo cáo lên blockchain.
7. Báo cáo chuyển sang `REPORTED`.

#### Quy tắc

- Không xóa báo cáo cũ.
- Báo cáo sửa đổi phải tạo phiên bản mới.
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
  → DRAFT phiên bản mới

REPORT_SUBMITTED
  → REPORT_APPROVED

REPORT_SUBMITTED
  → REPORT_REVISION_REQUESTED
  → REPORT_SUBMITTED phiên bản mới

WAITING_FOR_REPORT
  → OVERDUE

RECEIVING
CLOSED
WAITING_FOR_REPORT
REPORT_SUBMITTED
REPORT_APPROVED
  → SUSPENDED
  → REVOKED

```


DRAFT: Admin đang tạo hoặc chỉnh sửa hồ sơ.
PENDING_APPROVAL: Hồ sơ đã khóa, chờ School và LocalAuth ký.
RECEIVING: Hồ sơ bắt đầu nhận quyên góp.
CLOSED: Hồ sơ đạt mục tiêu hoặc hết thời hạn nhận tiền.
WAITING_FOR_REPORT: Đã đóng nhận và đang chờ báo cáo.
REPORT_SUBMITTED: Người nhận đã nộp báo cáo và minh chứng.
REPORT_APPROVED: Báo cáo đã được các bên có thẩm quyền xác nhận.
OVERDUE: Đã quá hạn nhưng chưa có báo cáo được xác nhận.

Điều kiện chuyển từ `REPORT_SUBMITTED` sang `REPORT_APPROVED`:
- Nếu tiền chuyển đến tài khoản người giám hộ: School và LocalAuth phải ký.
- Nếu tiền chuyển đến tài khoản trường: LocalAuth phải ký.


Khi báo cáo bị yêu cầu chỉnh sửa, hệ thống tạo một phiên bản báo cáo mới
trên cùng hồ sơ. Người dùng có thể sao chép dữ liệu từ phiên bản cũ sang
bản nháp mới để giảm thao tác nhập liệu. Dữ liệu được sao chép chỉ là bản
nháp và không làm thay đổi phiên bản cũ. Phiên bản mới phải được gửi và
xác nhận lại.

SUSPENDED
Trạng thái suspended có thể áp dụng cho mọi trạng thái có tác động thực tế:
```
    RECEIVING
    CLOSED
    WAITING_FOR_REPORT
    REPORT_SUBMITTED
    REPORT_APPROVED
    → SUSPENDED
    → REVOKED
```
Khi School hoặc LocalAuth phát hiện vấn đề:
1. Gửi yêu cầu đình chỉ.
2. Nhập lý do bắt buộc.
3. Hệ thống chuyển hồ sơ sang SUSPENDED.
4. Hồ sơ bị ẩn khỏi trang công khai.
5. Không nhận khoản quyên góp mới.
6. Các giao dịch và báo cáo cũ vẫn được giữ nguyên.
7. Hệ thống ghi audit log.
Trong MVP, cho phép một trong hai bên School hoặc LocalAuth đình chỉ để phản ứng nhanh.
Khi trong trạng thái SUSPENDED:
Không tạo khoản quyên góp mới cho hồ sơ.
Giao dịch ngân hàng đến sau đó vẫn được ghi nhận, nhưng gắn cờ AFTER_SUSPENSION.
Không chuyển hồ sơ sang CLOSED hoặc WAITING_FOR_REPORT trong thời gian đình chỉ.
Nếu hồ sơ được thu hồi, các giao dịch đã nhận không bị xóa.





REVOKED
Dùng khi xác minh xong và kết luận hồ sơ sai nghiêm trọng hoặc không còn hợp lệ.
Để nhất quán với quy trình phê duyệt, yêu cầu cả School và LocalAuth xác nhận thu hồi:
1. Một bên yêu cầu thu hồi và nhập lý do.
2. Bên còn lại xác nhận.
3. Hồ sơ chuyển sang REVOKED.
4. Hồ sơ không thể nhận quyên góp hoặc được mở lại.
5. Trang công khai hiển thị hồ sơ đã bị thu hồi cùng lý do ở mức phù hợp.
6. Không xóa giao dịch, báo cáo hoặc lịch sử.
REVOKED chỉ có thể xảy ra sau SUSPENDED


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
### Người có thẩm quyền
- Tiền chuyển đến tài khoản người giám hộ:
  School và LocalAuth cùng xác nhận.

- Tiền chuyển đến tài khoản trường:
  LocalAuth xác nhận.


### Trạng thái khoản quyên góp

- `PENDING_TRANSFER`: Hệ thống đã tạo yêu cầu quyên góp nhưng chưa nhận được webhook xác nhận tiền vào.
- `UNMATCHED`: Hệ thống đã nhận webhook tiền vào nhưng chưa xác định được hồ sơ hỗ trợ tương ứng.
- `RECONCILED`: Khoản tiền đã được ghép với một hồ sơ hỗ trợ.
- `CONFIRMED`: Khoản tiền đã được bên có thẩm quyền xác nhận.
- `EXPIRED`: Hết thời hạn chờ chuyển tiền nhưng không nhận được webhook tiền vào.


### Quy tắc chuyển trạng thái
Khoản quyên góp không được quay lại trạng thái trước và không được xóa.
Mọi thay đổi trạng thái phải tạo audit log.
- `PENDING_TRANSFER → RECONCILED`: webhook xác nhận tiền vào và mã tham chiếu khớp hồ sơ.
- `PENDING_TRANSFER → UNMATCHED`: webhook xác nhận tiền vào nhưng không tìm thấy mã tham chiếu hợp lệ.
- `UNMATCHED → RECONCILED`: Admin hoặc School gán giao dịch vào hồ sơ và ghi rõ lý do.
- `RECONCILED → CONFIRMED`: người có thẩm quyền xác nhận khoản tiền.
- `PENDING_TRANSFER → EXPIRED`: hết thời hạn chờ chuyển nhưng không có tiền vào.


Sơ đồ chuyển trạng và tác nhân:

| Chuyển trạng thái | Thực hiện bởi |
|---|---|
| `PENDING_TRANSFER → RECONCILED` | Hệ thống |
| `PENDING_TRANSFER → UNMATCHED` | Hệ thống |
| `UNMATCHED → RECONCILED` | Admin hoặc School |
| `RECONCILED → CONFIRMED` | Người có thẩm quyền |
| `PENDING_TRANSFER → EXPIRED` | Hệ thống tự động |


Hệ thống chỉ tạo commitment cho khoản quyên góp khi khoản đó chuyển sang
`CONFIRMED`.
Các commitment có thể được gom thành Merkle root. Hệ thống ghi Merkle root
lên blockchain khi các khoản quyên góp đã được xác nhận.
Dữ liệu dùng để tạo hash phải bao gồm tối thiểu:
- mã giao dịch nội bộ;
- số tiền;
- thời điểm nhận;
- mã hồ sơ;
- trạng thái `CONFIRMED`;
- các cờ bất thường có liên quan;
- phiên bản bản ghi.

Nếu dữ liệu của giao dịch đã `CONFIRMED` cần thay đổi, hệ thống không sửa
commitment cũ. Hệ thống tạo bản ghi điều chỉnh hoặc phiên bản mới và ghi rõ
lý do trong audit log.

Các quy tắc khi ghi lên blockchain
- `PENDING_TRANSFER`: chưa ghi blockchain.
- `UNMATCHED`: chưa ghi blockchain.
- `RECONCILED`: chưa ghi blockchain.
- `CONFIRMED`: đưa commitment vào Merkle root để ghi blockchain.
- `EXPIRED`: không ghi blockchain.


Gồm có hai cờ:
- Nếu giao dịch không có mã tham chiếu và được Admin/School gán thủ công,
  gắn cờ `MANUALLY_ASSIGNED`.
- Nếu thời điểm tiền vào sau khi hồ sơ chuyển sang `CLOSED`, gắn cờ
  `RECEIVED_AFTER_CLOSING`.
- Nếu webhook đến sau khi yêu cầu đã `EXPIRED`, hệ thống không chuyển ngược
  trạng thái. Giao dịch được ghi nhận riêng, gắn cờ `RECEIVED_AFTER_EXPIRY`
- Tổng tiền vượt mục tiêu được tính từ dữ liệu giao dịch, không lưu thành cờ.

### Giới hạn và điểm yếu của việc đối soát

Hệ thống không kiểm soát trực tiếp giao dịch ngân hàng. Hệ thống chỉ xử lý
dựa trên dữ liệu nhận được từ webhook hoặc dữ liệu được nhập thủ công.

Vì vậy:

- Hệ thống không thể ngăn người dùng chuyển vượt số tiền mục tiêu.
- Hệ thống không thể đảm bảo mọi giao dịch đều có mã tham chiếu chính xác.
- Hệ thống không thể đảm bảo webhook đến ngay hoặc luôn đầy đủ.
- Hệ thống không thể xác định tuyệt đối giao dịch thuộc về hồ sơ nào nếu
  không có mã tham chiếu hoặc bằng chứng bổ sung.
- Hệ thống không thể ngăn giao dịch đến sau khi hồ sơ đã đóng.
- Hệ thống không thể đảm bảo phát hiện chính xác 100% giao dịch vượt mức,
  giao dịch quá hạn hoặc giao dịch đến sau khi hồ sơ đóng.
- Các giao dịch chuyển trực tiếp ngoài luồng VietQR có thể không được ghép
  tự động với hồ sơ.
- Webhook trùng, webhook đến trễ hoặc dữ liệu webhook sai có thể làm chậm
  hoặc gây khó khăn cho quá trình đối soát.


---

## 7. Phân loại dữ liệu

### On-chain

On-chain không lưu dữ liệu cá nhân. MVP chỉ ghi commitment của các bản ghi
đã xác nhận và Merkle root. Trạng thái, chữ ký, thời gian và phiên bản nằm
trong payload đã hash hoặc trong metadata off-chain liên kết với commitment.

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
- Không sửa trực tiếp hồ sơ đã ký.
- Mọi phiên bản thay thế phải giữ được lịch sử phiên bản cũ.
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
```

## Phân loại tính năng

### Nên có trong phiên bản đầu tiên

Đây là phần core nên tập trung:

1. Tạo hồ sơ hỗ trợ ở mức tối giản.
2. Xác nhận hồ sơ bởi School và LocalAuth.
3. Phân tách dữ liệu on-chain/off-chain.
4. Webhook giao dịch giả lập.
5. Ghép giao dịch bằng mã tham chiếu.
6. Danh sách giao dịch không khớp để xử lý thủ công.
7. Vòng đời giao dịch:

```text
Chờ chuyển → Đã đối soát → Đã xác nhận
```

8. Vòng đời hồ sơ:

```text
Đang nhận → Đã đóng nhận → Chờ báo cáo → Đã báo cáo / Quá hạn
```

9. Trang công khai hiển thị:

- mục tiêu;
- tổng tiền đã xác nhận;
- tiến độ;
- trạng thái báo cáo;
- các khoản chi công khai.

10. Ghi commitment hoặc Merkle root lên testnet.
11. Audit log.
12. Báo cáo chi tiêu tối giản.
13. Biên nhận có mã giao dịch ngân hàng và transaction hash.
14. Phân quyền cơ bản cho Admin, School và LocalAuth.

### Nên để sau MVP

Các tính năng này có giá trị, nhưng không cần để chứng minh core:

- One-time link cho mạnh thường quân đến thăm.
- Quy trình đăng ký chuyến thăm.
- Log truy cập chi tiết cho từng one-time link.
- Xử lý hoàn tiền.
- Quy tắc phân bổ tiền vượt mức.
- Thông báo email, SMS hoặc push notification.
- Trang block explorer riêng.
- Hỗ trợ nhiều blockchain.
- Merkle batch tối ưu gas ở quy mô lớn.
- Tự động loại bỏ metadata ảnh nâng cao.
- Dashboard phân tích nâng cao.
- Cơ chế khiếu nại.
- Blacklist.
- Quyên góp định kỳ.
- Tài khoản người dùng cho mạnh thường quân.
- Theo dõi một khoản tiền xuyên suốt đến từng khoản chi.
- Tích hợp ngân hàng hoặc MoMo thật.
- Ví crypto và stablecoin.
- Smart contract giữ tiền.
- Cơ chế hoàn trả tự động.
- Multi-signature ở cấp blockchain thay vì chữ ký nghiệp vụ.
- Hỗ trợ nhiều loại tiền tệ.
- Ứng dụng mobile.

### Không nên triển khai trong phiên bản đầu tiên

Các phần này dễ làm dự án phức tạp hoặc tạo rủi ro lớn:

- Giữ tiền thật trong smart contract.
- Tự động quy đổi USDT/token sang VND.
- Cho phép hệ thống tự quyết định tiền vượt mức chuyển cho ai.
- Đưa tên, tuổi, giới tính, câu chuyện hoặc ảnh trẻ lên blockchain.
- Cho phép Admin sửa hồ sơ sau khi đã gửi duyệt.
- Cho phép xóa giao dịch hoặc báo cáo cũ.
- Cho phép một tài khoản Admin vừa tạo hồ sơ vừa tự xác nhận.
- Tự động xác minh một đứa trẻ là có thật bằng blockchain.
- Cam kết rằng blockchain chứng minh tiền đã đến đúng người.
- Theo dõi tiền của từng mạnh thường quân đến từng hóa đơn.
- Tích hợp thanh toán thật trước khi hoàn thiện cơ chế đối soát.

