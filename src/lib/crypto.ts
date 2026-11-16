import crypto from "node:crypto";

export type CommitmentInput = {
  id: string;
  schoolId: string | null;
  localAuthId: string | null;
  goalLimit: string | number;
  bankAccountNumber: string | null;
  situation: string | null;
  childName: string | null;
  childImage: string | null;
};

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16; // Standard 128-bit authentication tag

/**
 * Tạo commitment ổn định cho hồ sơ. Dữ liệu được sắp xếp cố định để
 * cùng một hồ sơ + salt luôn tạo ra cùng một SHA-256 digest.
 */
export function createRecordCommitment(input: CommitmentInput, salt = crypto.randomBytes(16).toString("hex")) {
  const canonical = JSON.stringify({
    algorithm: "SHA-256",
    record: {
      id: input.id,
      schoolId: input.schoolId,
      localAuthId: input.localAuthId,
      goalLimit: String(input.goalLimit),
      bankAccountNumber: input.bankAccountNumber,
      situation: input.situation,
      childName: input.childName,
      childImage: input.childImage,
    },
    salt,
  });

  return {
    algorithm: "SHA-256" as const,
    salt,
    commitment: `0x${crypto.createHash("sha256").update(canonical, "utf8").digest("hex")}` as `0x${string}`,
  };
}

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

