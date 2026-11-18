import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { GET } from "../../src/app/api/donations/tra-cuu/route";

const originalFindUnique = prisma.donation.findUnique;

afterEach(() => {
  prisma.donation.findUnique = originalFindUnique;
});

describe("GET /api/donations/tra-cuu", () => {
  it("rejects a missing transaction id without querying the database", async () => {
    let called = false;
    prisma.donation.findUnique = (async () => {
      called = true;
      return null;
    }) as unknown as typeof prisma.donation.findUnique;

    const response = await GET(new Request("http://localhost/api/donations/tra-cuu"));
    assert.equal(response.status, 400);
    assert.equal(called, false);
  });

  it("returns a confirmed donation by transaction id", async () => {
    prisma.donation.findUnique = (async () => ({
      transactionId: "SEPAY-123",
      amount: { toString: () => "250000" },
      transactionHash: "0x" + "a".repeat(64),
      referenceCode: "HS057CA-2F29",
      createdAt: new Date("2026-11-18T10:20:30.000Z"),
      recordId: "record-1",
    })) as unknown as typeof prisma.donation.findUnique;

    const response = await GET(
      new Request("http://localhost/api/donations/tra-cuu?transactionId=SEPAY-123"),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      found: true,
      status: "CONFIRMED",
      transactionId: "SEPAY-123",
      amount: "250000",
      transactionHash: "0x" + "a".repeat(64),
      referenceCode: "HS057CA-2F29",
      createdAt: "2026-11-18T10:20:30.000Z",
      recordId: "record-1",
    });
  });

  it("returns 404 when the transaction does not exist", async () => {
    prisma.donation.findUnique = (async () => null) as unknown as typeof prisma.donation.findUnique;

    const response = await GET(
      new Request("http://localhost/api/donations/tra-cuu?transactionId=UNKNOWN"),
    );
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.found, false);
  });
});
