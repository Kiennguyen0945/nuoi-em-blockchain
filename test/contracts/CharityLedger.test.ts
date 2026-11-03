import assert from "node:assert/strict";
import hre from "hardhat";

describe("CharityLedger Smart Contract", function () {
  it("should record commitment successfully", async function () {
    const charityLedger = await hre.viem.deployContract("CharityLedger");
    const campaignId = "CAMPAIGN-001";
    const commitment = ("0x" + "ab".repeat(32)) as `0x${string}`;

    await charityLedger.write.recordCommitment([campaignId, commitment]);
    const [savedCommitment, timestamp, recordedBy] = await charityLedger.read.getRecord([campaignId]);

    assert.equal(savedCommitment, commitment);
    assert.ok(timestamp > 0n);
    assert.ok(recordedBy.startsWith("0x"));
  });

  it("should revert if recording duplicate campaignId", async function () {
    const charityLedger = await hre.viem.deployContract("CharityLedger");
    const campaignId = "CAMPAIGN-002";
    const commitment = ("0x" + "cd".repeat(32)) as `0x${string}`;

    await charityLedger.write.recordCommitment([campaignId, commitment]);

    await assert.rejects(async () => {
      await charityLedger.write.recordCommitment([campaignId, commitment]);
    });
  });
});

