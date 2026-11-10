import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Hash mật khẩu bằng scrypt (Node.js built-in, không cần cài thêm thư viện).
 * Định dạng lưu trữ: scrypt$N$r$p$saltHex$derivedKeyHex
 * Dùng cho MVP. Production nên chuyển sang argon2/bcrypt.
 */
export function hashPassword(plain: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const key = scryptSync(plain, salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${key.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  try {
    const [scheme, nStr, rStr, pStr, saltHex, keyHex] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const N = Number(nStr);
    const r = Number(rStr);
    const p = Number(pStr);
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(keyHex, "hex");
    const actual = scryptSync(plain, salt, expected.length, { N, r, p });
    return (
      actual.length === expected.length &&
      timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}
