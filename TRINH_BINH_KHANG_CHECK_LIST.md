# BÁO CÁO — CHECKLIST CỦA TRỊNH BÌNH KHANG · Nuôi Em Blockchain

- **Người thực hiện:** Trịnh Bình Khang (`trinhbinhkhang-it`)
- **Ngày báo cáo:** 2026-11-15
- **Dự án:** Nuoi Em Blockchain — Sao kê từ thiện minh bạch (Next.js + Postgres + Prisma + Hardhat/Sepolia · VietQR)
- **Repo:** `Kiennguyen0945/nuoi-em-blockchain` · `main` hiện xanh CI, mọi PR đều đã merge

---

## 1. Tổng quan vai trò của bạn trong dự án

Bạn được phân công làm **[CHORE] Làm quen với quy trình nhóm** (thẻ Linear `nuo-2-connect-your-tools`) và sau đó được giao thêm **2 task CHORE + 1 task FEAT**. Bạn tự chọn làm thêm phần **Giao diện công khai + Trang đăng nhập thật** để hoàn thiện luồng MVP.

Mọi việc đều theo đúng chu trình Linear → nhánh `prefix/...` → PR → CI xanh → Merge vào `main`.

---

## 2. Checklist gốc trong PhanCong.md (task làm quen)

| # | Hạng mục | Trạng thái | Kết quả cụ thể |
|---|---|---|---|
| 1 | Lên Linear lấy tên nhánh | ✅ | Nhánh đầu: `docs/trinhbinhkhangit/nuo-2-connect-your-tools` → sau đó `feat/trinhbinhkhangit/binhkhang-cong-viec-dau-tien` |
| 2 | Khởi chạy dự án với docker | ✅ | `docker compose up -d` — Postgres 16 `healthy`, pgAdmin ở `:5050` |
| 3 | Tạo nhánh mới với prefix | ✅ | Mọi nhánh đúng prefix: `feat/`, `chore/`, `docs/` |
| 4 | Thử đồng bộ schema | ✅ | `npm run db:push` → "already in sync", `db:generate` OK |
| 5 | Kết nối ví ảo | ✅ | `npx hardhat node` — chainId 31337, `test:contracts` pass (7 tests) |
| 6 | Thử `npm run db:studio` | ✅ | Xem bảng `users`, `records`, `donations`, `audit_logs`, sơ đồ trống ban đầu |
| 7 | Đẩy lên git | ✅ | `git push` qua HTTPS (lúc đầu 403 → dùng quyền collaborator + fork workflow) |
| 8 | Tạo Pull Request | ✅ | Tạo qua GitHub API từ `git credential` (không cần `gh`) |
| 9 | Chạy CI/CD và merge vào `main` | ✅ | Toàn bộ 12 bước CI xanh (Install → Prisma push → TSC → Lint → Unit → Contract → Build) |

---

## 3. Ba task được giao (đều hoàn thành + merge)

### Task 2 — `[CHORE] Tạo bảng dữ liệu + 5 tài khoản`
**PR #23** (merge `81611d3`) · `chore/trinhbinhkhangit/tao-bang-csdl-3-quyen`

**Việc đã làm:**
- Giữ `prisma/schema.prisma` đúng theo `docs/database.puml`; đồng bộ DB qua `db:push`
- Viết `src/lib/password.ts` (scrypt hash + `timingSafeEqual` — không cài thêm thư viện)
- Viết `prisma/seed.ts` + lệnh `npm run db:seed`: 1 ADMIN + 2 SCHOOL + 2 LOCAL_AUTH + private key + 2 hồ sơ mẫu (1 DRAFT + 1 PENDING_APPROVAL)
- Kiểm chứng cách ly dữ liệu bằng SQL: School A chỉ thấy hồ sơ Trường A, LocalAuth Xã A chỉ thấy hồ sơ Xã A

**Mục đích:** Prove được khả năng phân biệt quyền xem dữ liệu trước khi làm tính năng phân quyền.

### Task 3 — `[FEAT] Cơ chế xác thực phân quyền xem`
**PR #24** (merge `8edabb3`) · `feat/trinhbinhkhangit/phan-quyen-xem`

**Việc đã làm:**
- `src/lib/permissions.ts` — 4 hàm thuần: `canAccessRecord`, `canViewL2`, `redactL2`, `filterRecordsForUser`
- **Admin**: chỉ xem L2 (`childName`, `childImage`) khi hồ sơ `DRAFT`; ẩn từ `PENDING_APPROVAL` trở lên
- **School**: chỉ thấy trẻ của trường mình (`schoolId === user.id`) — mọi trạng thái
- **LocalAuth**: chỉ thấy trẻ của xã mình (`localAuthId === user.id`) — mọi trạng thái
- NextAuth `credentials` thật + JWT mang `id`/`role`; `trustHost: true` (fix `UntrustedHost`)
- API: `GET /api/records`, `GET /api/records/[id]` — lọc server-side; 401/403 đúng
- Unit test: 12 test mới (tổng 14 pass) + 7 contract test pass

**Học được:** Phân quyền phải enforce **ở server**, không chỉ ở UI. L2 gồm gì. Cách che field khi trả JSON.

### Task 1 — `[CHORE] Giao diện 3 actor HTML/CSS`
**PR #25** (merge `0d5a42e`) · `chore/trinhbinhkhangit/giao-dien-3-actor-html-css`

**Việc đã làm:**
- `public/prototype.html` — 1 file tự chứa (HTML+CSS+JS), mô phỏng đúng `permissions.ts`
- 3 actor + 5 tài khoản giả chuyển vai bằng dropdown; CRUD (thêm/sửa/xóa/gửi duyệt); ký/từ chối chỉ khi `PENDING_APPROVAL` và đúng trường/xã; đủ 2 chữ ký → hồ sơ chuyển `RECEIVING`
- Quy tắc màu + Font Awesome 6 (sau khi bạn đổi yêu cầu icon)

**Tiêu chí nghiệm thu:** "Một file html/css để team test" → `http://localhost:3000/prototype.html`

---

## 4. Các task tự chọn làm thêm (hoàn thiện MVP)

### Trang /login thật + UI Next.js cho 3 actor — PR #26
**Merge `573523b`** · `feat/trinhbinhkhangit/login-ui-nextjs`

- `/login` thật: NextAuth credentials, tài khoản demo prefill, tự điều hướng `/admin` · `/school` · `/localauth` theo role
- 3 trang thật (server component + `requireRole()`):
  - `/admin`: CRUD đầy đủ (thêm/sửa DRAFT/xóa/gửi duyệt) — dropdown chọn trường/xã qua `/api/orgs`
  - `/school`: chỉ trẻ trường mình, nút Ký/Từ chối
  - `/localauth`: chỉ trẻ xã mình, nút Ký/Từ chối
- Modal + toast + records-board component dùng chung
- Server thật đã kiểm chứng: chưa đăng nhập → 307; Admin thấy L2 draft ẩn sau khi approve; School B 403 khi tạo hồ sơ

### Giao diện công khai cho MTQ + Sao kê + VietQR — PR #27
**Merge `514c6fc`** · `feat/trinhbinhkhangit/giao-dien-cong-khai-mtq`

- Trang chủ cộng đồng `/` (phong cách xanh hiền từ + cam ấm): hero, số liệu (hồ sơ / đang nhận / lượt góp / tổng đã đối soát), 3 bước quyên góp, cam kết blockchain
- `/ho-so`: lưới hồ sơ `RECEIVING` — placeholder ẩn danh, tiến độ %, số lượt góp, **lọc theo trường** (Tất cả / Xã A / Xã B / Xã C)
- `/ho-so/[id]`: sao kê đầy đủ — timeline trạng thái, progress bar, bảng giao dịch công khai (ẩn danh MTQ), khung "Toàn vẹn dữ liệu" (commitment on-chain)
- `/ho-so/[id]/quyen-gop`: Luồng 3 bước: chọn số tiền (preset + custom) → QR VietQR (account từ hồ sơ, `addInfo = reference_code`) → countdown 10' + poll `GET /api/donations/by-ref` mỗi 3s → màn hình cảm ơn
- `/tra-cuu`: tra cứu donation bằng `transaction_id`
- `/huong-dan`: "Vì sao minh bạch?" — 3 bước tự kiểm chứng + commitment
- `/403`: trang phân quyền
- `docs/BACKEND-INTEGRATION-GUIDE.md`: contract cho backend (`/api/donations/by-ref`, `/api/donations/tra-cuu`, `POST /api/webhook`), quy tắc `reference_code`, sơ đồ mermaid, checklist nghiệm thu
- `prisma/seed-demo.ts` + `npm run db:seed-demo`: **21 hồ sơ (7/trường × 3 trường)** — 9 `RECEIVING`, 37 donations (~35,5 triệu)
- Fix: `layout.tsx` nạp ` fontawesome-svg-core/styles.css` (icon FA không phình), favicon `icon.svg`, `.tsbuildinfo` khỏi git

### Tài liệu hỗ trợ team
**PR #28** (open) · `docs/getting-started`

- `docs/GETTING-STARTED.md`: 10 bước clone → chạy dự án cho thành viên mới + tài khoản demo + troubleshooting
- `docs/architecture.md`: sơ đồ kiến trúc (mermaid) — thành phần + vòng đời hồ sơ + phân luồng dữ liệu L1/L2/commitment
- `docs/BACKEND-INTEGRATION-GUIDE.md`: bàn giao backend
- `docs/reports/`: 5 báo cáo task theo quy chuẩn (`docs/reports/README.md`)
- `TEST.html` (draft thiết kế của bạn, màu indigo): giữ nguyên ở local, không commit

---

## 5. Những lỗi kỹ thuật đã tự xử lý

| Vấn đề | Nguyên nhân | Cách fix |
|---|---|---|
| `TS2488: unknown must have Symbol.iterator` | `hre.viem.deployContract` trả Abi generic | ABI tối thiểu + type `CharityLedgerContract`, 14 tests pass |
| `P1001: Can't reach database server` | Docker Desktop tắt | `docker compose up -d` → `healthy` |
| NextAuth `UntrustedHost` | v5 chưa trust host | `trustHost: true` trong `auth.ts` + `AUTH_TRUST_HOST=true` |
| Icon phình toàn màn hình | Thiếu CSS `.svg-inline--fa { height: 1em }` | Import `@fortawesome/fontawesome-svg-core/styles.css` trong `layout.tsx` |
| CI `npm ci` fail — `Missing: @emnapi/core@1.11.3` | `npm install` trên máy chạy **npm 11** rewrite toàn bộ lock không tương thích **npm 10** của CI | `npm i -g npm@10.9.9` + `checkout origin/main -- package-lock.json` + `npm install` (49 dòng thêm) |
| `.next` bị xoá khi dev server còn chạy | Deleting `.next` mid-run | Restart clean + production build |
| `feat/...login-ui-nextjs`漏掉 commit FontAwesome | PR #26 merge khi chỉ có b0b5db9; commit 792688b push sau | Cherry-pick vào nhánh công khai mới (4806a7f) |
| 2 merge liên tiếp main → #33 bị `cancel-in-progress` | Concurrency group trong workflow | Không phải lỗi — `0d5a42e` (main mới nhất) xanh toàn bộ |

---

## 6. Quy trình & kiến thức nghiệp vụ nắm được

- **Vòng đời hồ sơ:** `DRAFT → PENDING_APPROVAL → RECEIVING → WAITING_FOR_REPORT → CLOSED`
- **L1 vs L2:** L1 (công khai): mã hồ sơ, thông tin trường/xã, hoàn cảnh. L2 (bí mật): tên, ảnh trẻ → xem theo role
- **Dữ liệu on-chain:** chỉ `campaignId + commitment = hash(L1 + L2 + salt)` + timestamp + recordedBy → ai sửa hồ sơ đều bị phát hiện, không phục hồi
- **Sai thật & đúng thật:** số tiền MTQ chuyển tới thẳng TK trường qua VietQR; webhook ghi donations → tổng xác nhận = số ngân hàng báo
- **`transactionId @unique`** → idempotency, webhook gửi trùng không ghi 2 lần
- **Nghiệp vụ phân quyền:** Admin = nhập; School = ký + nhận tiền; LocalAuth = ký / từ chối / duyệt báo cáo; MTQ = quét QR ẩn danh
- **Mạnh thường quân không đăng nhập** — chỉ cần app ngân hàng

---

## 7. Tài khoản & dữ liệu demo hiện có

| Vai trò | Email | Đơn vị | Ghi chú |
|---|---|---|---|
| ADMIN | admin@nuoi-em.vn | Hệ thống | Quản trị |
| SCHOOL | truong1@nuoi-em.vn | Trường TH Xã A (THAXA01) | 7 em |
| SCHOOL | truong2@nuoi-em.vn | Trường TH Xã B (THBXA02) | 7 em |
| SCHOOL | truong3@nuoi-em.vn | Trường TH Xã C (THCXA03) | 7 em — tự thêm |
| LOCAL_AUTH | localauth_xa@nuoi-em.vn | UBND Xã A (UBXAA01) | 7 em |
| LOCAL_AUTH | localauth_xb@nuoi-em.vn | UBND Xã B (UBXAB02) | 7 em |
| LOCAL_AUTH | localauth_xc@nuoi-em.vn | UBND Xã C (UBXAC03) | 7 em — tự thêm |
| **Mật khẩu chung** | `Password123!` | | |

- 21 hồ sơ: 9 `RECEIVING` / 6 `PENDING_APPROVAL` / 6 `DRAFT` · 37 donations · tổng ~35.459.588 VNĐ
- Demo transaction_ids: `VIB202617003GUBY`, `VIB202616004WF1T`, `VIB202610003X693`
- DB sống dù Docker tắt (tự khởi động lại cả 2 lần máy reset) — hiện `healthy`

---

## 8. Các nhánh đã merged vào `main`

1. `feat/trinhbinhkhangit/binhkhang-cong-viec-dau-tien` — PR #22 — test: hoàn thiện CharityLedger contracts
2. `chore/trinhbinhkhangit/tao-bang-csdl-3-quyen` — PR #23 — Task 2
3. `feat/trinhbinhkhangit/phan-quyen-xem` — PR #24 — Task 3
4. `chore/trinhbinhkhangit/giao-dien-3-actor-html-css` — PR #25 — Task 1
5. `feat/trinhbinhkhangit/login-ui-nextjs` — PR #26 — /login thật + 3 actor
6. `feat/trinhbinhkhangit/giao-dien-cong-khai-mtq` — PR #27 — Công khai + sao kê + VietQR

---

## 9. Việc còn lại (theo Linear hiện tại)

- [ ] **[FEAT] Ký hồ sơ bằng private key** — `School` + `LocalAuth` ký `sha256(privateKey + recordId)` → tự chuyển `RECEIVING`; cập nhật on-chain commitment
- [ ] **[FEAT] Webhook VietQR + transaction_id** — nhận IPN, sinh QR độ phân giải, `POST /api/webhook`
- [ ] **[FEAT] Gắn giao dịch với hồ sơ và lưu on-chain** — ghép donation ↔ reference_code, chuyển trạng thái
- [ ] **Backend cho /api/donations/by-ref, /api/donations/tra-cuu, /api/webhook** (tài liệu `docs/BACKEND-INTEGRATION-GUIDE.md`)
- [ ] **Trang /login thật cho nhóm** — UI `/login` đã có; cần nối `signIn/out` button vào `role-shell.tsx`
- [ ] Xóa nhánh đã merge trên GitHub (`git push origin --delete ...`)

---

## 10. Đường dẫn file quan trọng

| Đường dẫn | Vai trò |
|---|---|
| `src/lib/permissions.ts` | Lõi phân quyền (canAccess / canViewL2 / redactL2 / filterRecordsForUser) |
| `src/lib/password.ts` | scrypt hash mật khẩu |
| `src/lib/auth.ts` | NextAuth credentials + JWT (trustHost) |
| `src/lib/public.ts` | Aggregate donations + public records |
| `prisma/schema.prisma` | 4 bảng: users, records, donations, audit_logs |
| `prisma/seed.ts`, `prisma/seed-demo.ts` | Seed 5 tài khoản / 21 hồ sơ |
| `src/app/ho-so/...` + `src/app/page.tsx` | Giao diện công khai MTQ |
| `src/components/records-board.tsx`, `role-shell.tsx`, `sign-out-button.tsx`, `public-shell.tsx`, `progress-bar.tsx` | Component dùng chung |
| `src/app/api/records/...`, `src/app/api/orgs/...` | API CRUD + sign |
| `docs/BACKEND-INTEGRATION-GUIDE.md`, `docs/architecture.md`, `docs/GETTING-STARTED.md`, `docs/reports/` | Tài liệu nhóm |
| `docs/reports/2026-11-1X-*.md` | Báo cáo 5 task đã merge |

---

*Viết bởi Trình Bình Khang (tổng hợp và rà soát cùng trợ lý AI) · 2026-11-15 · `main` xanh CI.*
