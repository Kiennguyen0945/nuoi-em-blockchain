500 chữ là tối đa, đây là giới hạn không phải gợi ý


## Luồng

1. Webhook nhận đúng transaction_id và amount = 2000
2. Donation được tạo trong database
3. Commitment được tạo
4. Blockchain transaction được gửi
5. Receipt thành công
6. API tra cứu trả đúng onchainStatus và blockchainTxHash
7. Đọc trực tiếp contract để xác nhận commitment

## Dữ liệu

### Dữ liệu cần hash để đưa on-chain

commitment = 
- donation_id
- record_id
- amount
- transaction_id
- created_at

Format amount là 2000.00
Khi nào tạo donation?
→ Chỉ sau webhook xác nhận tiền.

Commitment gồm những dữ liệu nào?
→ Tối thiểu transaction_id, amount, confirmed_at, profile_id hoặc record_id.

Khóa on-chain là gì?
→ Chọn donation_id

Nếu cùng một webhook gửi lại thì sao?
→ Không tạo donation trùng và không ghi blockchain trùng.

Nếu ghi blockchain thất bại thì sao?
→ Onchain_status = FAILED hoặc PENDING.

### Dữ liệu sẽ xuất hiện on-chain

On-chain:
mapping(donationKey => DonationRecord)
- commitment
- timestamp
- recordedBy

## Trạng thái

Bỏ trạng thái confimed của riêng donation, mặc định là bản ghi có trong donation là đã confirmed bằng  wehhook rồi
Retry tối đa 3 lần.

## Entity


```java
class Donations {
    - id : Long
    - record_id : String
    - amount : Double
    - transaction_id : String
    - created_at : DateTime
    - commitment : String
    - onchain_status : String {ONCHAIN_PENDING / ONCHAIN_SUBMITTED / ONCHAIN_CONFIRMED / ONCHAIN_FAILED}
    - blockchain_tx_hash : String
    - onchain_recorded_at : DateTime
    - onchain_error : String
    - retry_count : Integer
}
```

## Idempotency

Webhook lần 1 -> tạo donation -> ghi on-chain
Webhook lần 2 -> phát hiện transaction_id đã tồn tại -> không tạo lại

## Cách ghi on-chain

Ghi giao dịch trực tiếp, chiến lược ghi theo batch dựa trên Merkle Root sẽ phát triển sau

API tra cứu trả gì?
→ transaction_id, amount, profile_id, commitment, onchain_status, blockchain_tx_hash.

Ai được ghi lên contract?
→ Một backend wallet cố định.

Smart contract có cho ghi đè không?
→ Không.