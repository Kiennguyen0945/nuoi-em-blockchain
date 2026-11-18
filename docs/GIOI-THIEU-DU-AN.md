# GIỚI THIỆU DỰ ÁN — NUÔI EM (CHARITY LEDGER SYSTEM)

> **Phiên bản:** MVP · Đang phát triển · Cập nhật: 2026-11-18
> **Repo:** `Kiennguyen0945/nuoi-em-blockchain`

---

## 1. Ý NGHĨA DỰ ÁN LÀ GÌ?

### 1.1 Bối cảnh
Nuôi Em xuất phát từ một vụ lùm xùm liên quan đến chương trình "nuôi em" — mạnh thường quân chuyển tiền vào chương trình thiện nguyện, nhưng **không ai chứng minh được tiền đó thực sự đến tay trẻ em**. Vấn đề này tồn tại ở nhiều quỹ thiện nguyện và nhận được nhiều chỉ trích công khai.

### 1.2 Giải pháp này giải quyết vấn đề gì?
Dự án dùng **blockchain** + **VietQR** để đảm bảo:
- **Minh bạch dòng tiền**: mỗi khoản chuyển đều được ghi lại, có thể đối chiếu bất cứ lúc nào.
- **Chống sửa chữa**: hồ sơ trẻ em được cam kết trên chuỗi (`commitment = hash(L1 + L2 + salt)`); bất kỳ ai sửa phần mềm, đổi dữ liệu cũng bị phát hiện ngay.
- **Bảo vệ quyền riêng tư**: người xem chỉ thấy thông tin ở mức trung lập (đủ để biết "đang nuôi em nào, bao nhiêu, ở đâu") mà không thấy thông tin nhận dạng trẻ (L2).
- **Không cần tin ai**: mạnh thường quân thực hiện giao dịch ẩn danh — không cần đăng nhập, không cần ví crypto; chứng minh được bằng số dư ngân hàng + mã băm.

---

## 2. WEBSITE NÀY DÀNH CHO AI?

Có **3 nhóm người dùng chính** (gọi là 3 actor nội bộ) + **1 nhóm công khai** (mọi người xem và đóng góp ẩn danh):

| Actor | Vai trò trong đời thực | Vai trò trên hệ thống |
|---|---|---|
| **Admin** | Quản trị chương trình | Tạo hồ sơ trẻ em, nhập thông tin (L2 khi DRAFT), gửi duyệt |
| **School (Trường)** | Nhà trường tiếp nhận tiền | Xem trẻ của trường mình, ký/duyệt hồ sơ, nhận tiền chuyển vào TK trường |
| **LocalAuth (UBND)** | Cơ quan chức năng địa phương | Xác thực trẻ thật, ký/từ chối hồ sơ, duyệt báo cáo |
| **Public (Mọi người)** | Mạnh thường quân | Xem sao kê công khai, quyên góp qua quét VietQR, tra cứu giao dịch — không đăng nhập |

---

## 3. WEBSITE LÀM ĐƯỢC GÌ?

### 3.1 Với mạnh thường quân (public, không đăng nhập)

| Chức năng | URL | Mô tả |
|---|---|---|
| Xem trang chủ | `/` | Số liệu tổng quan (số hồ sơ, đã đối soát, đang nhận) |
| Xem danh sách hồ sơ | `/ho-so` | Các em đang chờ giúp, lọc theo trường |
| Xem chi tiết hồ sơ | `/ho-so/<id>` | Toàn cảnh: tiến độ, danh sách giao dịch đã xác nhận (không lộ MTQ) |
| **Quyên góp** | `/ho-so/<id>/quyen-gop` | Chọn số tiền → quét QR → tự động nhận tiền qua webhook |
| Tra cứu hồ sơ theo mã | `/tra-cuu-ho-so` | Dán mã hồ sơ là ra ngay kết quả |
| Tra cứu donation | `/tra-cuu` | Kiểm tra trạng thái khoản chuyển (đã nhận / chưa) |
| Vì sao minh bạch | `/huong-dan` | 3 bước tự kiểm chứng + commitment on-chain |

### 3.2 Với Admin (nội bộ)

| Chức năng | Mô tả |
|---|---|
| Tạo hồ sơ trẻ | Điền tên, hoàn cảnh, mục tiêu, số TK trường, trường + UBND phụ trách |
| Sửa hồ sơ (khi DRAFT) | Chỉ sửa được trong lúc draft |
| Xóa hồ sơ | Xóa hồ sơ sai (demo) |
| Gửi duyệt | Chuyển từ `DRAFT → PENDING_APPROVAL` (khóa hồ sơ) |
| Quản lý tổ chức | Xem danh sách trường/xã đang hoạt động |

### 3.3 Với School & LocalAuth (nội bộ)

| Chức năng | School | LocalAuth |
|---|---|---|
| Xem trẻ của mình | ✅ | ✅ (khu vực mình) |
| Xem trẻ của trường/xã khác | ❌ | ❌ |
| Xem L2 (tên, ảnh) | ✅ | ✅ |
| Ký hồ sơ | ✅ (trường) | ✅ (khu vực) |
| Từ chối hồ sơ | ✅ (phải ghi lý do) | ✅ (phải ghi lý do) |
| Duyệt báo cáo (WAITING_FOR_REPORT) | — (báo cáo do School nộp) | ✅ (chọn ACCEPT/REJECT) |
| Đóng hồ sơ | — | ✅ (sau khi report được duyệt) |

### 3.4 Với mạnh thường quân (public, ẩn danh)
- **Không cần đăng nhập**, không cần khai báo danh tính.
- Chỉ cần app ngân hàng quét VietQR → chuyển tiền.
- Có thể tra cứu mã giao dịch bất cứ lúc nào.

---

## 4. WEBSITE HOẠT ĐỘNG NHƯ THẾ NÀO (Luồng đầy đủ)

```
[Admin] Tạo hồ sơ trẻ (DRAFT)
       ↓
[Admin] Điền đầy đủ → Gửi duyệt → PENDING_APPROVAL
       ↓
[School] Ký       [LocalAuth] Ký
       ↓               ↓
       ← đủ 2 chữ ký → hồ sơ chuyển RECEIVING
                        ↓
       [MTQ] quét QR → chuyển tiền vào TK trường
                        ↓
       Webhook ngân hàng (SePay) ghi nhận donation
                        ↓
       Đủ mục tiêu → hồ sơ tự chuyển WAITING_FOR_REPORT
                        ↓
       School nộp minh chứng → LocalAuth duyệt → CLOSED
```

### 4.1 Khái niệm L1 / L2

**L1 — thông tin công khai** (ai cũng xem được, đủ để quyết định quyên góp):
- Mã hồ sơ, tên trường, tên UBND xã, tài khoản ngân hàng, hoàn cảnh, tổng tiền đã nhận, mục tiêu

**L2 — thông tin bí mật** (không bao giờ lên web/vào chain):
- Tên trẻ, ảnh trẻ
- Chỉ Admin (khi DRAFT) / School / LocalAuth mới xem được
- Các trang public chỉ trả L1; L2 bị che hoàn toàn

### 4.2 On-chain: commitment hash
Khi cả 2 bên ký, hệ thống ghi lên blockchain (Hardhat local / Sepolia):
```
commitment = sha256(L1 + L2 + salt)
```
- `salt` — số ngẫu nhiên 32 bytes, giữ trong DB.
- Commitment **không chứa thông tin**, chỉ để chứng minh "hồ sơ tồn tại và chưa bị sửa".
- Bất kỳ ai có salt đều có thể băm lại L1+L2+salt và so sánh với commitment trên chuỗi → phát hiện sai lệch.
- Cam kết được ghi 1 lần, không thể xóa/sửa trên chuỗi.

---

## 5. WHY BLOCKCHAIN? (Tại sao không chỉ dùng database?)

| Giải pháp | Ưu điểm | Nhược điểm |
|---|---|---|
| **Database truyền thống** | Dễ, nhanh | Admin có thể sửa dữ liệu; không ai biết |
| **Blockchain** | Bất biến, ai cũng verify được, không cần tin ai | Chậm, tốn gas, không lưu được nhiều dữ liệu |

**Kết luận của dự án:** dùng blockchain để ghi nhận **cam kết** (commitment), không lưu dữ liệu cá nhân lên chuỗi (vì vấn đề riêng tư). Mọi trạng thái quan trọng được chuẩn bị bởi cả 2 bên (multi-sig: School + LocalAuth) → không ai đơn phương sửa được.

---

## 6. CÔNG NGHỆ VÀ KIẾN TRÚC

### 6.1 Tech stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (monolith nhẹ)
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (Credentials + JWT)
- **Blockchain**: Hardhat + Solidity + viem → Sepolia testnet / Hardhat local
- **Payment**: VietQR (img.vietqr.io) + SePay (webhook)
- **Icons**: Font Awesome 6

### 6.2 Sơ đồ kiến trúc

```
┌───────────────┐      ┌──────────────────┐      ┌─────────────┐
│  MTQ / Admin  │ ───→ │  Next.js 14 App  │ ───→ │  PostgreSQL  │
│  School       │      │  (App Router)    │      │  (Docker)    │
│  UBND         │ ←──  │                  │ ←──  │              │
└───────────────┘      └────────┬─────────┘      └─────────────┘
                                │
                         ┌──────┴───────┐
                         │  Smart Contract│  ←── commitment = hash(L1+L2+salt)
                         │  (Hardhat/     │      (Sepolia testnet)
                         │   Sepolia)     │
                         └───────────────┘
```

### 6.3 Tổng quan dữ liệu

**4 bảng chính:**
- `users` — 1 ADMIN, nhiều SCHOOL (mỗi trường 1 tài khoản), nhiều LOCAL_AUTH (mỗi xã 1 tài khoản)
- `records` — hồ sơ trẻ em: tình huống, mục tiêu, trạng thái, school_id, local_auth_id
- `donations` — mỗi giao dịch: số tiền, transaction_id, hash, trạng thái on-chain
- `audit_logs` — ghi lại mọi thay đổi (ai làm gì lúc nào)

---

## 7. TỔNG QUAN CÁC TÍNH NĂNG CỦA MVP

### 7.1 Đã có (trên `main`)

| Nhóm | Chi tiết |
|---|---|
| **Đồng bộ schema** | Prisma sync Docker Postgres |
| **Seed dữ liệu** | 5 tài khoản demo + 21 hồ sơ mẫu + 37 donations |
| **Phân quyền** | Admin/School/LocalAuth + L1/L2, 14 unit tests pass |
| **Đăng nhập** | NextAuth credentials + JWT, `/login` |
| **API** | `/api/records`, `/api/records/[id]`, `/api/records/[id]/sign`, `/api/orgs` |
| **Trang công khai** | `/`, `/ho-so`, `/ho-so/[id]`, `/ho-so/[id]/quyen-gop`, `/tra-cuu`, `/huong-dan`, `/403`, `/tra-cuu-ho-so` |
| **Cơ chế ký** | School + LocalAuth ký, commitment on-chain |
| **Webhook SePay** | Nhận chuyển khoản, tự ghép donation ↔ hồ sơ, tự chuyển WAITING_FOR_REPORT |
| **CI/CD** | GitHub Actions: lint → unit test → contract test → build |

### 7.2 Đang chờ / chưa làm
- [ ] Ký hồ sơ bằng private key (đã merge PR #32)
- [ ] Báo cáo + duyệt báo cáo (WAITING_FOR_REPORT → ACCEPTED/REJECTED)
- [ ] Merkle root cho lô donation (tối ưu gas)
- [ ] Đăng ký đối tác thật (SePay account thật, banking thật)

---

## 8. MỤC ĐÍCH CUỐI CÙNG

> **"Người chuyển tiền tin được tiền đến tay trẻ, không cần biết ai quản lý hệ thống."**

Hệ thống này **không giữ tiền**, không tổ chức nhận tiền — chỉ là **sổ cái minh bạch** dựa trên blockchain, nơi bất kỳ ai cũng có thể kiểm chứng:

- Hồ sơ này có thật không → có sự xác nhận của 2 bên (School + UBND), được ghi trên chuỗi.
- Tiền đến đúng trường chưa → số dư tài khoản trường khớp với donations đã xác nhận.
- Hồ sơ có bị sửa không → so commitment trên chuỗi với dữ liệu hiện tại.

Đây là tinh thần **going beyond trust** — thay vì tin tưởng chủ quỹ thiện nguyện, người xem **tự kiểm chứng được** bằng mắt thường hoặc bằng công cụ.
