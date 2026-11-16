import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canAssignToRecord,
  extractRecordPrefix,
  extractReferenceCode,
  extractTransactionId,
} from "../../src/lib/sepay";

describe("SePay webhook payload", () => {
  it("reads transaction id from SePay id", () => {
    assert.equal(
      extractTransactionId({ id: 99868501, transactionId: "fallback" }),
      "99868501",
    );
  });

  it("falls back to transactionId when id is absent", () => {
    assert.equal(extractTransactionId({ transactionId: "TX-123" }), "TX-123");
  });

  it("normalizes reference code with or without the separator", () => {
    assert.equal(
      extractReferenceCode("QR HS057CA-2F29/2000", undefined),
      "HS057CA-2F29",
    );
    assert.equal(
      extractReferenceCode("QR HS057CA2F29/2000", undefined),
      "HS057CA-2F29",
    );
  });

  it("rejects content without a valid reference code", () => {
    assert.equal(extractReferenceCode("ung ho em hoc sinh", undefined), null);
  });

  it("extracts the record prefix used for assignment", () => {
    assert.equal(extractRecordPrefix("HS057CA-2F29"), "057ca");
  });

  it("assigns a donation only to the matching RECEIVING record", () => {
    assert.equal(
      canAssignToRecord("HS057CA-2F29", {
        id: "057ca22-96ba-4adc-858e-482a908a4f1",
        status: "RECEIVING",
      }),
      true,
    );
    assert.equal(
      canAssignToRecord("HS057CA-2F29", {
        id: "057ca22-96ba-4adc-858e-482a908a4f1",
        status: "DRAFT",
      }),
      false,
    );
    assert.equal(
      canAssignToRecord("HS057CA-2F29", {
        id: "535776db-9032-42b6-ad00-000000000000",
        status: "RECEIVING",
      }),
      false,
    );
  });

  it("does not assign when no record exists", () => {
    assert.equal(canAssignToRecord("HS057CA-2F29", null), false);
  });
});
