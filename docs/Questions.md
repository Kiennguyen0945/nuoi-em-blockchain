
1. Phương thức chuyển tiền
Mạnh thường quân ở Việt Nam đa phần chỉ có ngân hàng và ví điện tử (MoMo, ZaloPay). Họ có sẵn ví crypto không, và bạn kỳ vọng họ có phải học cách dùng ví không?
quét QR VietQR từ app ngân hàng hoặc ví, hệ thống nhận webhook (giả lập trong demo).
Nếu quyên góp bằng VND qua ngân hàng thì blockchain chỉ ghi lại chứ không giữ tiền. Bạn muốn blockchain chỉ làm sổ cái minh bạch, hay muốn tiền thực sự nằm trong smart contract?
Hệ thống đóng vai trà là một sổ cái điện tử, bao gồm việc ghi nhận và đối soát dữ liệu. Không giữ tiền thật
Nếu dùng token hoặc stablecoin (USDT, token riêng), ai chịu trách nhiệm quy đổi sang VND để đưa cho em? Khâu quy đổi này có tự phá tính minh bạch của cả hệ thống không?
Hệ thống chỉ đóng vai trò là một sổ cái điện tử, dùng để đối chiếu thông tin giao dịch. Không có một khâu quy đổi chính thức 
Pháp luật Việt Nam hiện đang quản lý tiền mã hóa và hoạt động gây quỹ từ thiện như thế nào? Hệ thống của bạn cần đứng dưới tư cách pháp lý nào (tổ chức, quỹ, hay chỉ là công cụ)?
Hệ thống sẽ dưới góc độ là một công cụ hỗ trợ. Không hoạt động dưới dạng tổ chức hoặc quỹ
Phí giao dịch (gas fee) ai trả? Một khoản quyên góp 50.000đ có còn ý nghĩa nếu phí cao hơn nhiều so với số tiền?
Trong phiên bản đầu tiên, tiền phí vận hành sẽ do bên hạ tầng chịu trách nhiệm. Các chức năng như là quyên góp cho hệ thống hạ tầng sẽ được hoãn lại
Sử dụng các cơ chế như L2 và Merkle root để gom nhiều giao dịch thay vì xử lý riêng lẻ
Bạn chọn blockchain công khai (Ethereum, Polygon...) hay riêng tư/consortium? Mỗi lựa chọn đánh đổi gì giữa tính công khai và chi phí/kiểm soát?
Công khai, dữ liệu phải minh bạch, ai cũng có thể tiến hành đối chiếu và sao kê
2. Xác thực trẻ em là có thật
Blockchain chỉ đảm bảo dữ liệu không bị sửa sau khi ghi, không đảm bảo dữ liệu ghi vào là đúng. Bạn nghĩ vấn đề “rác vào, rác ra” này nên giải quyết ở đâu?
Đây là điểm yếu nhất của hệ thống. Cần có sự phối hợp của bên thứ ba, bao gồm nhà trường và cơ quan chức năng. Hệ thống giả định là thông tin người quản trị viên đưa ra đã được xác thực bởi nhà trường và các cơ quan chức năng
Ai là người xác minh ngoài admin? Có nên có nhiều bên cùng xác nhận (nhà trường, chính quyền địa phương, tổ chức từ thiện) trước khi hồ sơ được đăng không?
Hệ thống sử dụng cơ chế multi-signature bao gồm:
Chữ Ký của Admin
Chữ Ký của School (nhà trường)
Chữ ký của LocalAuth (Cơ quan chính quyền địa phương)
Hash của hồ sơ gốc (giấy xác nhận hoàn cảnh, giấy tờ nhà trường) có nên được lưu on-chain để sau này ai cũng đối chiếu được không, trong khi bản gốc vẫn giữ kín?
Có, cần phải giữ on-chain để sau này đối chiếu
Nếu admin là một người duy nhất, điều gì ngăn họ tạo hồ sơ giả? Có nên chia quyền (người tạo hồ sơ ≠ người duyệt ≠ người giải ngân) không?
Admin sau khi tạo hồ sơ thì cần có xác nhận của nhà trường và chính quyền địa phương
Admin chỉ có quyền write-only, sau đó chỉ có thể 

Giai đoạn
Admin làm được gì với cấp 2
Đang soạn (nháp)
Nhập và sửa trong form, vì chưa gửi duyệt
Đã gửi duyệt
Không xem lại, không sửa. Hồ sơ khóa chờ School và LocalAuth ký
Đã ký
Không đọc được, API không trả cấp 2 cho vai trò Admin
Phát hiện sai sót
Gửi yêu cầu chỉnh sửa; School hoặc LocalAuth sửa, và hệ thống ghi commitment mới thay thế bản cũ (bản cũ vẫn còn trên chuỗi)


Khi mạnh thường quân muốn đến thăm hoặc kiểm chứng, hệ thống hỗ trợ ra sao mà vẫn bảo vệ được trẻ?
Thông tin on-chain bao gồm một child_id + commitment, commiment = hash(dữ liệu + salt). Dữ liệu ở đây là toàn bộ thông tin tài khoản của bé bao gồm cả cấp một và hai
Thông tin off-chain có hai cấp độ. Thông tin off-chain cần có khả năng thu hồi nếu được yêu cầu
Cấp độ 1 (off-chain công khai)
Mã hồ sơ
Tên Trường
Tên Ủy ban nhân dân địa phương
Cấp độ 2 (off-chain riêng tư, chỉ bên ký hồ sơ là nhà trường và cơ quan chính quyền địa phương có thể thấy)
Các thông tin cá nhân khác của bé
Lưu ý: thông tin cấp độ hai chỉ có trường và cơ quan chính quyền tại chịu trách nhiệm mới có thể thấy. Trường này không thể thấy thông tin trẻ em trường khác, và cơ quan địa phương không thể thấy thông tin của trẻ ở địa phương khác
Chỉ muốn xác thực thông tin
Hệ thống chứa child_id + commitment
MTQ (Mạnh thường quân) có thể dựa vào child_id (mã hồ sơ) để tra cứu thông tin trong bảng ánh xạ off-chain để lấy thông tin ở cấp độ 1
Mã hash (commitment) dùng để kiểm tra tính toàn vẹn, không dùng để tra cứu
Muốn đến thăm trực tiếp
MTQ gửi yêu cầu từ hệ thống -> Yêu cầu cần có -> tên thật, CCCD, SĐT, Ngày thăm
Hệ thống gửi yêu cầu đến nhà trường và chính quyền địa phương
Nhà trường chấp nhận và chính quyền ký xác nhận -> Hệ thống cấp quyền tạm thời, one-time link cho phép xem thông tin của trẻ ở cấp độ 2 ở thời gian ngắn

Đối tượng
Cách truy cập kho hạn chế
MTQ
Chỉ khi được hai bên duyệt, qua one-time link, có hạn dùng ngắn
Nhà trường, chính quyền
Đăng nhập theo vai trò, xem thường xuyên, không cần one-time link


3. Dòng tiền thu và chi

Lớp
Trạng thái
Giao dịch (quyên góp)
Chờ chuyển → Đã đối soát → Đã xác nhận, nhánh phụ Yêu cầu Hết hạn, và Chờ gán hồ sơ là trạng thái bắt đầu của khoản không ghép được mã.
Yêu cầu hết hạn: 30p
Hồ sơ của bé
Đang nhận → Đã đóng nhận → Chờ báo cáo → Đã báo cáo / Quá hạn báo cáo
Quá hạn báo cáo: 30 ngày
Báo cáo
Đã nộp → Đã ký đủ (hoặc được thay thế bằng báo cáo mới)


[Chờ chuyển] ──webhook khớp mã──→ [Đã đối soát] ──đủ chữ ký──→ [Đã xác nhận]
     │
     └──quá hạn, chưa có tiền──→ [Hết hạn]

Webhook có tiền vào nhưng không ghép được mã
     └──→ [Chờ gán hồ sơ] ──admin/trường gán vào hồ sơ──→ [Đã đối soát]

Chờ gán hồ sơ khi
Nhà trường nhận quyên góp cho hồ sơ HS-0012. Webhook báo về: “+500.000đ, lúc 09:14, nội dung: ung ho em hoc sinh”. Hệ thống tìm mã tham chiếu HS0012-A7K2 trong nội dung nhưng không thấy, vì:
MTQ xóa nội dung mặc định rồi tự gõ lại, hoặc
MTQ không quét QR mà chuyển thẳng vào số tài khoản.
Tiền có thật, nhưng hệ thống không biết nó dành cho bé nào. Nếu bỏ qua, khoản này biến mất khỏi sổ cái: MTQ không có biên lai, tổng thu của hồ sơ thấp hơn thực tế, và người nhận có tiền mà không bị buộc phải báo cáo. Điều đó trái với mục tiêu minh bạch.


“Thu” thì dễ ghi, còn “chi” thì sao? Tiền được đưa cho em bằng cách nào (chuyển khoản cho phụ huynh, trả thẳng học phí, mua đồ dùng)? Mỗi cách để lại bằng chứng gì?
Hệ thống sẽ lưu vào lịch sử giao dịch
Làm sao chứng minh khoản chi đã đến đúng người? Có cần hóa đơn, ảnh biên nhận, xác nhận của người nhận được băm và ghi lên chuỗi không?
Vòng đời của hồ sơ sẽ bao gồm 5 trạng thái
Đang nhận -> đã đóng nhận -> chờ báo cáo -> đã báo cáo/ đã quá hạn
Đã đóng nhận: kích hoạt khi đạt số tiền mục tiêu hoặc hết hạn. Hệ thống chỉ hiển thị trạng thái này vì không chặn được chuyển khoản ngân hàng. Khoản chuyển thêm sau đó vẫn được ghi, nhưng đánh dấu là “sau khi đóng”.
Quá hạn báo cáo: nếu sau 30 ngày vẫn chưa có báo cáo hoàn chỉnh -> chuyển thành đã quá hạn
Quy trình xác nhận
Người nhận nộp minh chứng
Minh chứng gồm hai loại
Cấp 1 (Công khai)
Ảnh sản phẩm đã mua
Dữ liệu có cấu trúc do người dùng tự nhập: ngày, số tiền, hạng mục, tên cửa hàng, số hóa đơn. 
Cấp 2 (Hạn chế - one-time link) 
Hóa đơn, biên lai gốc (thường có tên bé), và mọi ảnh có người hoặc nơi ở.
Lưu ý: 
Dữ liệu cấp hai vẫn được hash và lưu on-chain, nên khi ai đó xem ở cấp 2 thì vẫn đối chiếu được	
Người nhận nhấn xác thực, đảm bảo hình ảnh tải lên không chứa thông tin nhạy cảm
Cơ quan có thẩm quyền tiến hành duyệt
report_id sẽ có một mã hash tổng hợp gọi là evidence_root = hash (dữ liệu ảnh/bảng). report_id tham chiếu tới child_id
Vai trò của hệ thống
Loại bỏ metadata của ảnh


Khi quyên góp vượt số tiền cần hỗ trợ cho một em thì xử lý thế nào: chuyển sang em khác, hoàn lại, hay giữ vào quỹ chung? Quy tắc này có nằm trong smart contract để không ai đổi được không?
Giao dịch sẽ được gắn cờ "vượt mức". Nó sẽ được xử lý và quyết định hoàn toàn bởi bên thụ hưởng
Trang công khai sẽ hiển thị gì: tổng thu, tổng chi, từng giao dịch, số dư còn lại của từng em? Người xem thường (không rành kỹ thuật) đọc được hay phải xem trên block explorer?
Mục tiêu và tiến độ: đã xác nhận nhận X / mục tiêu Y, còn thiếu Z.
Tách rõ: khoản “MTQ khai đã chuyển, chờ xác nhận” và khoản “đã được xác nhận”.
Trạng thái báo cáo (đã báo cáo, quá hạn) và các hạng mục chi đã khai.
Mỗi giao dịch có đường dẫn “xem trên block explorer” cho ai muốn tự kiểm chứng; người thường chỉ cần đọc trang web của hệ thống.


Chi phí vận hành hệ thống (server, nhân sự) có được trích từ quỹ không? Nếu có, khoản trích này hiển thị ra sao?
Do nhóm phát triển tự chi trả sử dụng testnet nên không phát sinh phí gas thật
4. Phân chia on-chain và off-chain
Tiêu chí nào để quyết định một thông tin nằm on-chain hay off-chain? Hiện bạn để cả tên, tuổi, giới tính, câu chuyện lên on-chain, mà dữ liệu on-chain thì gần như không xóa được. Điều này ảnh hưởng thế nào đến quyền riêng tư của trẻ (dưới 16 tuổi) và quyền được lãng quên?
on-chain chỉ giữ thứ cần chống sửa và không chứa dữ liệu cá nhân (mã định danh ngẫu nhiên, hash, chữ ký, thời gian, trạng thái); mọi thông tin nhận diện hoặc có thể bị yêu cầu xóa nằm off-chain.
Nếu gia đình sau này muốn rút lại thông tin thì sao?
xóa cả salt và dữ liệu off-chain liên quan
“Mã hash” trong danh sách on-chain là hash của cái gì (toàn bộ hồ sơ, hay dữ liệu off-chain)? Dùng để làm gì khi đối chiếu?
Câu chuyện dài nên lưu on-chain hay chỉ lưu hash, còn nội dung để off-chain?
5. Luồng của mạnh thường quân (đang để trống)
Họ cần đăng ký tài khoản không, hay quyên góp ẩn danh? Ẩn danh có xung đột với mục tiêu minh bạch không?
Họ không cần đăng ký tài khoản và có thể quyên góp ẩn danh
Khi họ thanh toán xong, hệ thống in một biên lai với mã tx hash
Thành phần TX Hash
Ý nghĩa
nonce
Số thứ tự giao dịch của ví gửi
to
Địa chỉ nhận, ở đây là smart contract của bạn
value
Số coin gốc chuyển kèm (thường bằng 0)
data (calldata)
Nội dung bạn ghi lên chuỗi: tên hàm và tham số, ví dụ Merkle root của lô giao dịch
Các trường phí
Gas limit, gas price (hoặc phí theo EIP-1559)
chainId
Mã chuỗi, chống phát lại trên chuỗi khác
Chữ ký (v, r, s)
Chữ ký của ví gửi

Tầng 1: Chuyển tiền thật (ngoài blockchain)
  MTQ ── quét QR ──> app ngân hàng / MoMo ──> tài khoản người nhận
  (xác thực bằng mật khẩu, vân tay, OTP của app đó; không có chữ ký crypto)
                          │
                    webhook báo về
                          ▼
Tầng 2: Ghi sổ cái (trên blockchain)
  Hệ thống ── ví của hệ thống ký ──> giao dịch blockchain ──> smart contract
  (ghi Merkle root của lô giao dịch đã đối soát)

Ví của hệ thống ở đây là một cặp khóa (bí mật và công khai)
Vì blockchain yêu cầu mọi lần ghi dữ liệu phải do một tài khoản trả phí gas. Cần một tài khoản như vậy để ghi commitment, merkle root. Là một tài khoản đăng nhập để ghi sổ cái, không phải để giữ tiền
Tiền:      MTQ ──────────────> tài khoản ngân hàng của bên thụ hưởng
Dữ liệu:   webhook ──> hệ thống ──(ví blockchain ký)──> ghi lên blockchain

Họ có nhận được “bằng chứng” quyên góp (biên nhận, thông báo khi tiền được chi, báo cáo cập nhật về em) không?
phát hành khi “đã đối soát”, nội dung gồm mã giao dịch ngân hàng và tx hash; ghi rõ không phải chứng từ pháp lý.
Họ có thể theo dõi riêng khoản đóng góp của mình đến tận đâu?
Khoản của riêng MTQ theo dõi được đến khi tiền vào tài khoản người nhận (qua các trạng thái: chờ chuyển, đã đối soát, đã xác nhận). Sau đó tiền không còn gắn với từng người góp, nên MTQ chỉ theo dõi được báo cáo chung của bé, không theo dõi từng đồng của mình.
Quyên góp một lần hay định kỳ (nuôi hằng tháng như chương trình gốc)?
Hoãn việc quyên góp định kỳ chỉ cho quyên góp một lần
giải pháp tối thiểu là trang công khai của hồ sơ tự cập nhật khi có báo cáo mới. 

Cảnh báo cho MTQ với tiêu chí cụ thể (khoản đã đối soát mà chưa ký quá M ngày, báo cáo quá hạn, khiếu nại được ghi nhận). Mục blacklist cũ đã biến mất, nên xác nhận bạn chủ động bỏ.
Ký theo lô khi hồ sơ đóng nhận, và log truy cập cho cả one-time link lẫn tài khoản trường, chính quyền.
