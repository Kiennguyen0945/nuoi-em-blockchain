2026-11-01 11:46
Status: 
Tags:

## Dự án làm gì?

Dự án hỗ trợ sao kê từ thiện lấy ý tưởng từ vụ lùm xùm nuôi em

## Kịch bản demo 5 phút

Kịch bản 1:
Admin: Tạo hồ sơ
School: Ký
LocalAuth: Ký

Trạng thái hồ sơ
DRAFT -> PENDING_APPROVAL -> RECEIVING -> WAITING_FOR_REPORT -> CLOSED

DRAFT: Là bản nháp, admin có thể chỉnh sửa tại đây. Admin có thể nhập và thấy thông tin cấp 2 lúc này. Admin đưa từ DRAFT sang PENDING_APPROVAL
PENDING_APPROVAL: Đợi School và LocalAuth ký
RECEIVING: là hồ sơ chỉ chuyển sang RECEIVING khi cả School và LocalAuth ký, và đang trong trạng thái nhận tiền
WAITING_FOR_REPORT khi đã nhận đủ chỉ tiêu, do hệ thống tự chuyển
CLOSED: Report đã được chấp nhận bởi cơ quan chức năng


Nếu hồ sơ đã chuyển sang trạng thái PENDING_APPROVAL thì admin không thể thấy được thông tin cấp 2
LocalAuth của khu vực có thể thấy được L2
School của trẻ có thể thấy được thông tin L2

Kịch bản 2:
Admin: Tạo hồ sơ
School hoặc LocalAuth từ chối và ghi lý do
PENDING_APPROVAL -> DRAFT -> nhập lại -> ký lại từ đầu 
PENDING_APPROVAL  thì admin không được phép chỉnh hồ sơ


Kịch bản 3:
Mạnh thường quân đóng góp
- Hồ sơ ở trạng thái RECEIVING
- Mạnh thường quân chọn hồ sơ trẻ
- Mạnh thường quân bấm quyên góp
- HIện mã VietQR
- Mạnh thường quân chuyển tiền vào tài khoản trường
- Hệ thống ghi nhận qua webhook và ghi vào donation
	- mã hash giao dịch
	- số tiền
	- thời gian

Mã hash giao dịch = TransactionId + dữ liệu + salt
Người dùng ẩn danh tra cứu giao dịch bằng TransactionId

Trạng thái giao dịch: PENDING_TRASFER  -> CONFIRMED/OVERDUE
PENDING_TRANSFER:  gửi mã qr và bắt đầu đếm người chưa lưu donation
Tiền đã được chuyển thành công và ghi nhận vào Donation: CONFIRMED


Kịch bản 4:
School nộp minh chứng về việc trẻ đã nhận tiền
- Hồ sơ ở trạng thái WAITING_FOR_REPORT
	- Trường đưa ảnh minh chứng đã che thông tin nhạy cảm
WAITING_FOR_REPORT
-> PENDING_REQUEST: Minh chứng của trường đang được đợi phê duyệt
	-> Minh chứng chưa được hiển thị công khai
-> REJECTED: LocalAuth từ chối với lý do
	-> chuyển về PENDING_REQUEST cho nhà trường chỉnh sửa
	-> Đây là trạng thái của minh chứng, không phải hồ sơ
-> ACCEPTED: LocalAuth chấp nhận
	-> Minh chứng được hiển thị công khai
-> CLOSED: Đóng hồ sơ



### Ký hồ sơ
Nhà trường và chính quyền địa phương được cấp một mã private key
Chỉ cần bấm xác nhận tiến hành dùng private key đó để ký lên hồ sơ, giao diện chỉ cần school và chính quyền địa phương ấn xác nhận
Private key được lưu ở database local ở MVP, mỗi tài khoản school và localAuth có một private key riêng

### Ai được làm gì?

Admin: Nhập hồ sơ
School: Nhận tiền, chỉ ký hồ sơ không ký báo cáo
LocalAuth: Ký, từ chối hồ sơ, từ chối báo cáo
Mạnh thường quân: Chuyển tiền

### Vòng đời donation

reference_code: dùng để tìm hồ sơ giao dịch
transaction_id: phòng trường hợp webhook gửi nội dung lại 2 lần, ghép ghi trùng một giao dịch vào donation. Lấy ID từ webhook của VietQR

Khi mà QR của VietQR hiện lên thì phải kèm theo mã reference_code. 
Chặn luôn việc mạnh thường quân sửa mô tả


### Dữ liệu có gì?
Thông tin on-chain bao gồm: mã hồ sơ + commitment
commitment = hash(L1 + L2 + salt)
Hệ thống ghi, ghi lúc chuyển sang trạng thái RECEIVING, 

Thông tin off-chain bao gồm: 
- L1: off-chain công khai
	- Mã hồ sơ
	- Tên Trường
	- Số tài khoản trường
	- Tên địa phương
	- Minh chứng hash
	- Hoàn cảnh
- L2: off-chain không công khai
	- Tên trẻ
	- Ảnh


## Phân công

10 thẻ công việc linear, tối đa 300 chữ, đây là giới hạn. Viết để người đọc không phải AI đọc, ngắn gọn, súc tích, không cần hoàn hảo

2 thẻ để thành viên trong nhóm làm quen với quy trình linear -> github pull request -> basic cicd -> viết test -> sửa file ở chỗ nào, code ở đâu

[CHORE] Việc cho anh T làm quen
- copy file .env.example và đôi tên thành .env
- Đồng bộ scheme vào postgres bằng `npm run db:push` và `npm run db:generate`
- Lên linear lấy tên nhánh
- Khởi chạy dự án với docker
- tạo nhánh mới với prefix trong README.md
- Thử đồng bộ scheme trong hướng dẫn README.md
- Kết nối ví ảo trong hướng dẫn READ.md
- Thử chạy npm run db:studio để vào giao diện quản lý cơ sở dữ liệu của prisma
- Đẩy lên git
- Tạo pull_request
- Chạy cicd và merge vào main
Tiêu chí nghiệm thu:
Cần hiểu được quy trình làm việc nhóm chung thông qua pull_request
Làm quen với cicd căn bản


[CHORE] Việc cho anh V làm quen
- Khá tương tự anh T
- copy file .env.example và đôi tên thành .env
- Đồng bộ scheme vào postgres bằng `npm run db:push` và `npm run db:generate`
- Lên linear lấy tên nhánh
- Khởi chạy dự án với docker
- tạo nhánh mới với prefix trong file hướng dẫn
- Viết một đoạn code (đọc hướng dẫn thêm tính năng trong README.md)
- Thử chạy npm run db:studio để vào giao diện quản lý cơ sở dữ liệu của prisma
- Đẩy lên git
- Tạo pull_request
- Chạy cicd và merge vào main
Tiêu chí nghiệm thu:
Cần hiểu được quy trình làm việc nhóm chung thông qua pull_request
Làm quen với cicd căn bản


[DOCS] Viết một file docs hướng dẫn cách làm việc nhóm
- File đó phải nói rõ quy trình lên linear lấy việc
- Các quy tắc quan trọng như không được push lên main
- Thêm prefix cho công việc
- Nếu muốn viết test thì viết khu vực nào
- Nếu muốn viết tính năng thì viết khu vực nào


[CHORE] Tạo bảng cơ sở dữ liệu với 3 quyền căn bản là School, Admin, LocalAuth
- Một bảng cơ sơ dữ liệu dự theo thiết kế cua database.uml
- Tạo 5 tài khoản 1 admin, 2 school, 2 localAuth để chứng minh luồng trường này không thể xem thông tin trẻ em trường khác


[CHORE] Xây dựng giao diện school, admin và localAuth căn bản bằng html/css
- Dựa vào phân tích nghiệp vụ tiến hành xây dựng giao diện cơ bản cho 3 actor
- Tính năng thêm sửa xóa căn bản
- Có thể dùng claude để tìm bản màu, dùng qwen 3.8 max thinking để tạo prototype mẫu
Tiêu chí nghiệm thu: Một file html/css để team test

[FEAT] Quy trình ký hồ sơ bằng private_key
- Tạo private key cho school và local auth
- Admin tạo hồ sơ
- School và Local Auth tiến hành ký hồ sơ
- Hồ sơ chuyển sang trạng thái receiving
- Chọn thuật toán để hash hồ sơ và lưu on-chain (có  thể chọn SHA-256)
Gợi ý: có thể test trực tiếp qua API thay vì giao diện


[FEAT] Webhook VietQR và transaction_id
- Tìm hiểu về cách việt webhook VIETQR trả dữ liệu vè
- Sinh mã QR dựa trên số tài khoản
- Tìm hiểu cách chỉnh sửa nội dung giao dịch để thêm mã hồ sơ và chặn không cho chỉnh sửa
Tiêu chí nghiệm thu: Nhận được webhook thử và đọc được transaction_id.

[FEAT] Gắn giao dịch với hồ sơ và lưu on-chain
- Tìm hồ sơ thông qua nội dung giao dịch và gắn giao dịch với hồ sơ
- Lấy dữ liệu transaction_id và chuyển trạng thái giao dịch từ pending_trasfer sang confirmed



[FEAT] Cơ chế xác thực phân quyền xem của admin, school và localauth
Admin xem và nhập L2 khi hồ sơ ở draft. Admin không xem được L2 từ approval trở lên. School chỉ xem trẻ em trường mình. LocalAuth chỉ xem trẻ em khu vực mình.
Có test cho từng quy tắc, đều pass.