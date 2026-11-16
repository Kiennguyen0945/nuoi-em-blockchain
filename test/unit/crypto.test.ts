import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRecordCommitment, encryptLevel2, decryptLevel2 } from "../../src/lib/crypto";

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

describe("Record commitment (SHA-256)", () => {
  const record = {
    id: "record-1",
    schoolId: "school-1",
    localAuthId: "local-auth-1",
    goalLimit: "1000000",
    bankAccountNumber: "9704000000000001",
    situation: "Hoàn cảnh khó khăn",
    childName: "Em A",
    childImage: null,
  };

  it("creates a deterministic bytes32 commitment for the same record and salt", () => {
    const first = createRecordCommitment(record, "fixed-salt");
    const second = createRecordCommitment(record, "fixed-salt");
    assert.equal(first.commitment, second.commitment);
    assert.match(first.commitment, /^0x[0-9a-f]{64}$/);
    assert.equal(first.algorithm, "SHA-256");
  });

  it("changes the commitment when the record changes", () => {
    const first = createRecordCommitment(record, "fixed-salt");
    const changed = createRecordCommitment({ ...record, situation: "Hoàn cảnh khác" }, "fixed-salt");
    assert.notEqual(first.commitment, changed.commitment);
  });
});
