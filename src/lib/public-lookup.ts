/**
 * Logic tra cứu hồ sơ công khai.
 * Chỉ trả L1 (công khai) — tuyệt đối không trả L2 (childName/childImage).
 */

export type LookupRecord = {
  id: string;
  situation: string | null;
  status: string;
  goalLimit: number | string;
  bankAccountNumber: string | null;
  school?: {
    organizationName: string | null;
    organizationCode: string | null;
  } | null;
  localAuth?: {
    organizationName: string | null;
    organizationCode: string | null;
  } | null;
};

export function normalizeLookupQuery(q: string): string {
  return (q ?? "")
    .toUpperCase()
    .replace(/[-\s]/g, "")
    .replace(/^HS/, "");
}

export function recordMatchesQuery(
  record: Pick<LookupRecord, "id" | "situation">,
  query: string,
): boolean {
  const q = normalizeLookupQuery(query);
  if (q.length < 2) return false;

  const id = record.id.replaceAll("-", "").toUpperCase();
  const sit = (record.situation ?? "")
    .toUpperCase()
    .replace(/[-\s]/g, "");

  return id.includes(q) || sit.includes(q);
}
