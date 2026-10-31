import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encryptLevel2, decryptLevel2 } from "../../src/lib/crypto";

describe("Level 2 Encryption (AES-256-GCM)", () => {
  it("should encrypt and successfully decrypt back to original text", () => {
    const originalText = "Nguyễn Văn A - 0123456789 - Xã Mường Nhé";
    const encrypted = encryptLevel2(originalText);

    assert.ok(encrypted.cipherText, "Cipher text should not be empty");
    assert.equal(encrypted.iv.length, 24, "IV should be 12 bytes (24 hex characters)");
    assert.equal(encrypted.authTag.length, 32, "AuthTag should be 16 bytes (32 hex characters)");

    const decrypted = decryptLevel2(
      encrypted.cipherText,
      encrypted.iv,
      encrypted.authTag
    );
    assert.equal(decrypted, originalText);
  });

  it("should fail decryption when auth tag is tampered", () => {
    const originalText = "Secret PII data";
    const encrypted = encryptLevel2(originalText);

    // Tamper with the authTag
    const tamperedAuthTag = "00000000000000000000000000000000";

    assert.throws(() => {
      decryptLevel2(encrypted.cipherText, encrypted.iv, tamperedAuthTag);
    }, /Unsupported state or unable to authenticate data/);
  });
});
