- Không chứng minh tính chính xác của thông tin đầu vào nếu chưa có bên xác minh.


Mạnh thường quân truy cập hệ thống, xem thông tin các em và chọn hỗ trợ cho trẻ em mình muốn.


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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Vai trò</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Quyền chính</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Admin</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tạo hồ sơ, tiếp nhận giao dịch chưa khớp, theo dõi hệ thống</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">School</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xác nhận hồ sơ, xem dữ liệu thuộc trường</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">LocalAuth</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xác nhận hồ sơ, xem dữ liệu thuộc địa phương</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Người nhận</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Nộp minh chứng và báo cáo</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Mạnh thường quân</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem thông tin công khai, tra cứu khoản quyên góp</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Blockchain Writer</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Ghi commitment và Merkle root lên blockchain</td>
    </tr>
  </tbody>
</table>
</div>


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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Khái niệm</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Mô tả</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Hồ sơ hỗ trợ</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hồ sơ của một trẻ cần được hỗ trợ</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Donation</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Khoản tiền được chuyển vào tài khoản thụ hưởng</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Reconciliation</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quá trình đối chiếu giao dịch với hồ sơ</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Report</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Báo cáo sử dụng tiền</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Evidence</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Minh chứng cho báo cáo</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Commitment</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hash của dữ liệu được ghi nhận</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">On-chain record</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Bằng chứng đã ghi trên blockchain</td>
    </tr>
  </tbody>
</table>
</div>

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
Khi trong trạng thái SUSPENDED:## 1. Mục tiêu

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 28%; min-width: 160px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Hạng mục</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Lý do cắt</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Thay thế trong MVP</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Chữ ký kép School + LocalAuth (duyệt hồ sơ, xác nhận khoản quyên góp, duyệt báo cáo)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Cán bộ xã/phường hoặc giáo viên ngại đăng nhập hệ thống mới để "ký duyệt"</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Chỉ LocalAuth ký, không cần School ký thêm</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tài khoản nhận tiền của người giám hộ (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">GUARDIAN</code>)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">MVP hướng đến trẻ em vùng cao và gia đình khó khăn; tiền chuyển qua nhà trường</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Chỉ hỗ trợ tài khoản nhà trường (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">SCHOOL</code>)</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">SUSPENDED</code> và <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REVOKED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quá nhiều nhánh rẽ (edge cases) cho việc gian lận</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Cờ <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">IS_ACTIVE</code> (Boolean). School hoặc LocalAuth ẩn hồ sơ khỏi trang công khai và ghi lý do vào audit log; LocalAuth bật lại (mục 5.2)</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Versioning cho hồ sơ và báo cáo</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Là tính năng của hệ thống CMS/ERP phức tạp</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Cho phép sửa trực tiếp (overwrite) khi đang ở trạng thái cho phép sửa, lưu thay đổi vào <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">audit_logs</code></td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Merkle Tree và batching</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Là tư duy của hệ thống production có hàng triệu giao dịch</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Ghi trực tiếp hash của từng bản ghi lên testnet hoặc L2 giá rẻ (Base, Polygon, Arbitrum)</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Blockchain Writer là vai trò riêng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không cần tách riêng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Gộp vào Backend Worker (cron job hoặc queue)</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Người nhận tự tạo báo cáo và tải minh chứng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Đối tượng thụ hưởng thường không có kỹ năng dùng web/app</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Wizard of Oz: Người nhận gửi ảnh hóa đơn qua Zalo cho Admin/Trường, Admin tải lên và gắn vào hồ sơ</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tạo trước Donation khi phát sinh yêu cầu chuyển tiền</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tăng số trạng thái chờ và trạng thái hết hạn cho Donation</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Donation chỉ được tạo sau khi nhận và xác thực webhook (mục 5.3, 5.4)</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Vai trò</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Quyền chính</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Admin</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tạo và sửa hồ sơ khi <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">DRAFT</code>, gửi duyệt, gán giao dịch chưa khớp, nhập báo cáo và minh chứng thay Người nhận, theo dõi hệ thống. Không được ẩn hồ sơ</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">School</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem dữ liệu thuộc trường mình, gán giao dịch chưa khớp, ẩn hồ sơ thuộc trường mình, gửi yêu cầu bật lại. Không ký duyệt, không xác nhận</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">LocalAuth</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Duyệt hồ sơ, xem dữ liệu thuộc địa phương mình, xác nhận hoặc từ chối khoản quyên góp, duyệt báo cáo, ẩn và bật lại hồ sơ, xử lý yêu cầu bật lại của School</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Người nhận</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Gửi ảnh hóa đơn, minh chứng qua Zalo cho Admin/Trường (không thao tác trực tiếp trên hệ thống)</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Mạnh thường quân</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem thông tin công khai, lấy mã VietQR, tra cứu khoản quyên góp</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 28%; min-width: 180px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Dữ liệu</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Admin</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">School</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">LocalAuth</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Mạnh thường quân</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hồ sơ L2, khi <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">DRAFT</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem và sửa</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hồ sơ L2, sau khi gửi duyệt</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem (trường mình)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem (địa phương mình)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hồ sơ L1 (gồm câu chuyện)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Mô tả và ảnh minh chứng, khi <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REPORT_DRAFT</code> hoặc <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REPORT_REVISION_REQUESTED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Nhập, sửa, thay file</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Mô tả và ảnh minh chứng, sau khi gửi</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Chỉ xem bản che của ảnh, không xem lại mô tả L2</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem (trường mình)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem (địa phương mình)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tổng tiền đã sử dụng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Nhập khi <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REPORT_DRAFT</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xem sau <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REPORT_APPROVED</code></td>
    </tr>
  </tbody>
</table>
</div>

---

## 4. Các khái niệm chính và mô hình dữ liệu

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Khái niệm</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Mô tả</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Hồ sơ hỗ trợ (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">cases</code>)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hồ sơ của một trẻ cần được hỗ trợ. Có <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">recipient_account_id</code> và cờ <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">IS_ACTIVE</code></td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Yêu cầu chuyển tiền (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">transfer_requests</code>)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Mỗi lần tạo VietQR sinh một <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">reference_code</code> dùng một lần, có thời hạn. Chưa phải Donation</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Donation</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Khoản tiền đã phát sinh, được tạo sau khi nhận và xác thực webhook</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Webhook (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">webhook_events</code>)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Nhật ký mọi webhook nhận được và kết quả xử lý</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Confirmation (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">confirmations</code>)</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Từng lần LocalAuth xác nhận hoặc từ chối một Donation hay báo cáo</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Reconciliation</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quá trình đối chiếu giao dịch với hồ sơ</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Report</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Báo cáo sử dụng tiền</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Evidence</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Minh chứng cho báo cáo</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Commitment</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hash của dữ liệu được ghi nhận</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">On-chain record</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Bằng chứng đã ghi trên blockchain</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">audit_logs</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Ai làm, vai trò, thời điểm, trường nào, giá trị cũ/mới, lý do</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">reactivation_requests</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Yêu cầu bật lại hồ sơ của School</td>
    </tr>
  </tbody>
</table>
</div>

### 4.1. Hai mã định danh cần phân biệt

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Mã</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Vai trò</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">reference_code</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Nằm trong nội dung chuyển khoản hoặc VietQR, dùng để tìm hồ sơ nhận tiền</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">provider_transaction_id</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Mã giao dịch của nhà cung cấp, duy nhất, dùng chống webhook trùng</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Người thực hiện</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Cách bật lại</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">LocalAuth</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Bật lại trực tiếp, kể cả hồ sơ do School ẩn hay do chính mình ẩn. Phải nhập lý do, không cần ai xác nhận thêm</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">School</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không tự bật lại. Gửi yêu cầu bật lại kèm lý do. LocalAuth chấp nhận (hồ sơ bật lại) hoặc từ chối (phải ghi lý do)</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 28%; min-width: 160px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Chuyển trạng thái</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Điều kiện</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Thực hiện bởi</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">(tạo mới) → <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECONCILED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Webhook hợp lệ, chưa trùng, mã tham chiếu khớp hồ sơ</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">(tạo mới) → <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">UNMATCHED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Webhook hợp lệ, chưa trùng, không có mã tham chiếu hợp lệ</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">UNMATCHED → RECONCILED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Gán vào hồ sơ, ghi rõ lý do</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Admin hoặc School</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECONCILED → CONFIRMED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xác nhận khoản tiền, lưu vào <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">confirmations</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">LocalAuth</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECONCILED → REJECTED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Từ chối khoản tiền, ghi lý do, lưu vào <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">confirmations</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">LocalAuth</td>
    </tr>
  </tbody>
</table>
</div>

#### Cờ của Donation

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 28%; min-width: 160px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Cờ</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Gắn khi nào</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Gắn bởi</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECEIVED_AFTER_CLOSING</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Thời điểm tiền vào (theo giờ ngân hàng trong webhook) sau thời điểm hồ sơ sang <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">CLOSED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống, lúc đối soát</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECEIVED_AFTER_SUSPENSION</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Thời điểm tiền vào nằm trong khoảng hồ sơ đang <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">IS_ACTIVE = false</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống, lúc đối soát</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECEIVED_AFTER_EXPIRY</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Webhook đến sau khi yêu cầu chuyển tiền đã <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">EXPIRED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống, lúc nhận webhook</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">MANUALLY_ASSIGNED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Giao dịch không có mã tham chiếu, được Admin hoặc School gán thủ công</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Hệ thống, khi gán</td>
    </tr>
  </tbody>
</table>
</div>

- Webhook đến sau khi yêu cầu đã `EXPIRED` không làm đổi ngược trạng thái. Giao dịch vẫn được ghi nhận và gắn cờ `RECEIVED_AFTER_EXPIRY`.
- Tổng tiền vượt mục tiêu được tính từ dữ liệu giao dịch, không lưu thành cờ.

#### Commitment và blockchain

Hệ thống chỉ tạo commitment cho Donation khi chuyển sang `CONFIRMED`. Backend Worker ghi hash của từng bản ghi `CONFIRMED` lên testnet (hoặc L2 giá rẻ).

Dữ liệu tạo hash tối thiểu gồm: mã giao dịch nội bộ, số tiền, thời điểm nhận, mã hồ sơ, trạng thái `CONFIRMED`, các cờ bất thường liên quan.

Nếu dữ liệu của giao dịch đã `CONFIRMED` cần thay đổi, hệ thống không sửa commitment cũ. Hệ thống tạo bản ghi điều chỉnh và ghi rõ lý do trong audit log.

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Trạng thái</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Ghi blockchain</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">UNMATCHED</code>, <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">RECONCILED</code>, <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REJECTED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;"><code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">CONFIRMED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Có, ghi hash</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 28%; min-width: 160px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Nội dung</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Cấp</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tổng số tiền đã sử dụng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">L2 khi nhập, L1 sau <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REPORT_APPROVED</code></td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Chỉ công khai sau khi được duyệt</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Mô tả ngắn việc sử dụng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">L2</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không công khai</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Ảnh minh chứng</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">L2</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Không công khai</td>
    </tr>
  </tbody>
</table>
</div>

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

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Nhóm</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Hạng mục</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Mạnh thường quân</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">One-time link đến thăm; quy trình đăng ký chuyến thăm; log truy cập chi tiết cho từng one-time link; tài khoản người dùng cho mạnh thường quân</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tiền và đối soát</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tài khoản nhận tiền của người giám hộ (<code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">GUARDIAN</code>) kèm quy tắc School và LocalAuth cùng xác nhận; xử lý hoàn tiền (kể cả với Donation <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">REJECTED</code>); quy tắc phân bổ tiền vượt mức; quyên góp định kỳ; nhiều loại tiền tệ; theo dõi một khoản tiền xuyên suốt đến từng khoản chi; công khai chi tiết từng khoản chi; tích hợp ngân hàng hoặc MoMo thật</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Blockchain</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Trang block explorer riêng; nhiều blockchain; Merkle batch tối ưu gas; ví crypto và stablecoin; smart contract giữ tiền; cơ chế hoàn trả tự động; multi-signature ở cấp blockchain</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Vận hành và quản trị</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Thông báo email, SMS, push; dashboard phân tích nâng cao; cơ chế khiếu nại; blacklist; đường duyệt hồ sơ bằng "Minh chứng duyệt" do Admin upload (PDF/ảnh có dấu mộc xác nhận của địa phương), kèm cờ <code style="background-color: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;">APPROVED_VIA_EVIDENCE</code> trong commitment, hiển thị công khai khác với duyệt bằng chữ ký, audit log ghi người upload cùng hash của file</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Kỹ thuật khác</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Tự động loại bỏ metadata ảnh nâng cao; ứng dụng mobile; Người nhận tự nộp báo cáo; versioning hồ sơ và báo cáo; luồng đình chỉ/thu hồi nhiều bước</td>
    </tr>
  </tbody>
</table>
</div>

---

## 11. Không triển khai trong phiên bản đầu tiên

Các phần này dễ làm dự án phức tạp hoặc tạo rủi ro lớn:

<div style="overflow-x: auto; margin: 20px 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e293b, #334155); color: #ffffff;">
      <th style="width: 25%; min-width: 140px; padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Hạng mục</th>
      <th style="padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #475569;">Rủi ro chính</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Giữ tiền thật trong smart contract</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Rủi ro tài chính và pháp lý</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tự động quy đổi USDT/token sang VND</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Rủi ro tài chính và pháp lý</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tích hợp thanh toán thật trước khi hoàn thiện cơ chế đối soát</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Chưa kiểm soát được đối soát</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cho phép hệ thống tự quyết định tiền vượt mức chuyển cho ai</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quyết định nghiệp vụ nhạy cảm, cần con người</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Đưa tên, tuổi, giới tính, câu chuyện hoặc ảnh trẻ lên blockchain</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Lộ dữ liệu cá nhân, không thể xóa</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cho phép Admin sửa hồ sơ sau khi đã gửi duyệt</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Phá vỡ độ tin cậy của việc duyệt</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cho phép Admin ẩn hồ sơ</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quyền ẩn thuộc về School và LocalAuth, tránh Admin đơn phương gỡ hồ sơ</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cho phép xóa giao dịch hoặc báo cáo cũ</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Phá vỡ tính bất biến</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cho phép một tài khoản Admin vừa tạo hồ sơ vừa tự xác nhận</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Xung đột lợi ích</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Tự động xác minh một đứa trẻ là có thật bằng blockchain</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Blockchain không làm được việc này</td>
    </tr>
    <tr style="background-color: #ffffff; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Cam kết rằng blockchain chứng minh tiền đã đến đúng người</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Blockchain chỉ chứng minh dữ liệu không bị sửa</td>
    </tr>
    <tr style="background-color: #f8fafc; transition: background-color 0.15s ease;">
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; font-weight: 600; color: #0f172a;">Theo dõi tiền của từng mạnh thường quân đến từng hóa đơn</td>
      <td style="padding: 12px 16px; border: 1px solid #e2e8f0; vertical-align: top; color: #334155;">Quá phức tạp, không cần để chứng minh core</td>
    </tr>
  </tbody>
</table>
</div>

---

## 12. Điểm cần xác nhận

### Đã chốt

- **Duyệt hồ sơ:** chỉ LocalAuth ký trên hệ thống. Đường Admin upload "Minh chứng duyệt" chuyển sang mục 10.
- **Tài khoản nhận tiền:** chỉ `SCHOOL`. `GUARDIAN` chuyển sang mục 10.
- **Xác nhận khoản quyên góp và duyệt báo cáo:** chỉ LocalAuth. Ghi `confirmations` gồm tên tài khoản, thời điểm, kết quả. Bên từ chối đưa Donation sang `REJECTED`.
- **Donation:** chỉ tạo sau webhook hợp lệ. Chống trùng bằng `provider_transaction_id`.
- **Ẩn và bật lại hồ sơ:** School và LocalAuth được ẩn trong phạm vi mình, Admin không. LocalAuth bật lại tự do, School phải gửi yêu cầu.
- **Báo cáo:** công khai chỉ tổng số tiền đã sử dụng, sau `REPORT_APPROVED`. Chấp nhận trạng thái `REPORT_DRAFT`.