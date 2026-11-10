# Kiến trúc hệ thống NuôiEm - Charity Ledger System

> Cập nhật: 2026-11-10
> Xem sơ đồ: GitHub tự render Mermaid trong file này. VS Code: mở file này → Ctrl+Shift+V (preview). Không cần cài extension.

## 1. Kiến trúc tổng thể

```mermaid
flowchart TB
    subgraph Client["Trình duyệt (client)"]
        MTQ["Mạnh thường quân<br/>(không cần đăng nhập)"]
        ADMIN["Quản trị Admin"]
        SCHOOL["🏫 School (nhà trường)"]
        LOCALAUTH["🏛️ LocalAuth (UBND xã)"]
    end

    subgraph Next["Next.js 14 (App Router) - src/app"]
        UI["Pages / UI<br/>src/app/page.tsx..."]
        API["API Routes<br/>src/app/api/webhook<br/>src/app/api/auth/[...nextauth]"]
    end

    subgraph Lib["Tầng dùng chung - src/lib"]
        AUTH["auth.ts<br/>NextAuth (credentials + JWT)<br/>role: ADMIN / SCHOOL / LOCAL_AUTH"]
        PW["password.ts<br/>scrypt hash mật khẩu"]
        CRYPTO["crypto.ts<br/>AES-256-GCM mã hoá L2"]
        PRISMA["prisma.ts<br/>Prisma Client"]
        VIEM["viem.ts<br/>Public/Wallet client (Sepolia)"]
    end

    subgraph DB["Cơ sở dữ liệu"]
        PG[("PostgreSQL 16 (Docker)<br/>localhost:5432 - db: charity_ledger")]
        PGA["pgAdmin :5050"]
    end

    subgraph Chain["Blockchain (testnet)"]
        HH["Hardhat Node (local :8545)<br/>chainId 31337"]
        CONTRACT["CharityLedger.sol<br/>records[campaignId] = {commitment, timestamp, recordedBy}"]
        SEP["Sepolia (khi demo thật)"]
    end

    MTQ -->|"quét VietQR xem trang hồ sơ"| UI
    ADMIN --> UI
    SCHOOL --> UI
    LOCALAUTH --> UI

    UI --> API
    API --> AUTH
    API --> PRISMA
    API --> VIEM

    AUTH --> PW
    AUTH --> PRISMA
    VIEM --> HH
    VIEM --> CONTRACT
    VIEM -.-> SEP

    PRISMA --> PG
    CRYPTO --> PRISMA
    PGA --- PG
```

## 2. Vòng đời hồ sơ (state machine)

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Admin tạo/nhập L2<br/>(chỉ ADMIN thấy L2 lúc này)
    DRAFT --> PENDING_APPROVAL: Admin gửi duyệt<br/>(L2 khóa với Admin)
    PENDING_APPROVAL --> DRAFT: School/LocalAuth từ chối + lý do
    PENDING_APPROVAL --> RECEIVING: School ký + LocalAuth ký<br/>→ ghi commitment on-chain
    RECEIVING --> WAITING_FOR_REPORT: Đủ chỉ tiêu (hệ thống tự chuyển)
    WAITING_FOR_REPORT --> CLOSED: LocalAuth chấp nhận báo cáo
```

## 3. Luồng dữ liệu & phân quyền xem

```mermaid
flowchart LR
    subgraph L2["L2 - off-chain bí mật<br/>(AES-256-GCM)"]
        CHILD["Tên trẻ + ảnh"]
    end
    subgraph L1["L1 - off-chain công khai"]
        PUB["Mã hồ sơ · Tên trường · Tài khoản · Tên xã<br/>Hoàn cảnh · Minh chứng hash"]
    end
    subgraph ON["On-chain (minh bạch, không chứa PII)"]
        CHAIN["campaignId + commitment<br/>commitment = hash(L1 + L2 + salt)"]
    end

    CHILD -->|hash| CHAIN
    L2 -.->|chỉ School của trẻ & LocalAuth của xã<br/>đọc được; Admin chỉ khi DRAFT| ADMINREAD["Admin (DRAFT) · School (trường mình) · LocalAuth (xã mình)"]
    L1 --> PUBVIEW["Ai cũng xem được<br/>(trang công khai)"]
```

## 4. Luồng quyên góp (VietQR + webhook)

```mermaid
sequenceDiagram
    participant MTQ as Mạnh thường quân
    participant UI as Trang hồ sơ (Next.js)
    participant Bank as App Ngân hàng/VietQR
    participant API as API /webhook
    participant DB as PostgreSQL (donations)
    participant Chain as CharityLedger (on-chain)

    MTQ->>UI: Chọn hồ sơ RECEIVING
    UI->>MTQ: Hiển thị mã VietQR + reference_code (mã hồ sơ)
    MTQ->>Bank: Quét QR, chuyển tiền
    Bank->>API: Webhook - tiền vào (kèm reference_code)
    API->>DB: Ghi donation (amount, transaction_id, hash)
    API->>Chain: (Khi cần đối soát) commitment hash của hồ sơ
    MTQ->>UI: Tra cứu bằng TransactionId (ẩn danh, không đăng nhập)
```

## 5. Ai làm gì (tóm tắt quyền)

```mermaid
flowchart TB
    A["ADMIN<br/>Nhập hồ sơ (DRAFT) + thấy L2 khi DRAFT<br/>Từ PENDING_APPROVAL trở đi KHÔNG thấy L2"]
    S["SCHOOL<br/>Ký hồ sơ · Nhận tiền · Xem L2 trẻ trường mình · Nộp báo cáo"]
    L["LOCAL_AUTH<br/>Ký hoặc từ chối hồ sơ · Duyệt báo cáo · Xem L2 trẻ xã mình"]
    M["MẠNH THƯỜNG QUÂN<br/>Không đăng nhập · Quét VietQR · Tra cứu bằng transactionId"]
```

## 6. Cấu trúc thư mục đáng chú ý

```
src/app/api/webhook/route.ts     - nhận webhook VietQR
src/app/api/auth/[...nextauth]/  - đăng nhập (credentials + JWT)
src/lib/auth.ts                  - cấu hình NextAuth + phân quyền
src/lib/crypto.ts                - AES-256-GCM cho L2
src/lib/password.ts              - scrypt hash mật khẩu
prisma/schema.prisma             - users, records, donations, audit_logs
prisma/seed.ts                   - seed 5 tài khoản demo + hồ sơ mẫu
contracts/CharityLedger.sol      - smart contract ghi commitment on-chain
docs/reports/                    - báo cáo task theo quy chuẩn nhóm
```
