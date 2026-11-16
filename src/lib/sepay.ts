export const REF_CODE_REGEX = /HS([A-Z0-9]{5})(?:-)?([A-F0-9]{4})/i;

/** Extract and normalize a reference code from SePay transfer content. */
export function extractReferenceCode(content: unknown, referenceCode?: unknown) {
  const searchPool = `${content ?? ""} ${referenceCode ?? ""}`;
  const match = searchPool.match(REF_CODE_REGEX);
  if (!match) return null;
  return `HS${match[1].toUpperCase()}-${match[2].toUpperCase()}`;
}

export function extractRecordPrefix(referenceCode: string) {
  return referenceCode.slice(2, 7).toLowerCase();
}

export function canAssignToRecord(
  referenceCode: string,
  record: { id: string; status: string } | null,
) {
  if (!record || record.status !== "RECEIVING") return false;
  return record.id.replaceAll("-", "").toLowerCase().startsWith(
    extractRecordPrefix(referenceCode),
  );
}

/** SePay's event id is the idempotency key for a donation. */
export function extractTransactionId(body: {
  id?: unknown;
  transactionId?: unknown;
}) {
  const value = body.id ?? body.transactionId;
  return value == null ? null : String(value).trim() || null;
}
