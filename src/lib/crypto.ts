import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16; // Standard 128-bit authentication tag

function getKey(): Buffer {
  const hexKey = process.env.AES_256_GCM_KEY;
  if (!hexKey) {
    throw new Error("Missing AES_256_GCM_KEY in environment variables");
  }
  return Buffer.from(hexKey, "hex");
}

/**
 * Mã hóa chuỗi dữ liệu cấp 2 bằng AES-256-GCM
 */
export function encryptLevel2(plainText: string): {
  cipherText: string;
  iv: string;
  authTag: string;
} {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    cipherText: encrypted,
    iv: iv.toString("hex"),
    authTag,
  };
}

/**
 * Giải mã chuỗi dữ liệu cấp 2 bằng AES-256-GCM
 */
export function decryptLevel2(
  cipherText: string,
  ivHex: string,
  authTagHex: string
): string {
  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(cipherText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

