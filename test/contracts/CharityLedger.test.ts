import assert from "node:assert/strict";
import hre from "hardhat";

/**
 * ABI tối thiểu của CharityLedger để gõ chặt cho test.
 * Tránh lỗi TS2488: `Type 'unknown' must have Symbol.iterator` khi destructure
 * kết quả `read.getRecord` của `hre.viem.deployContract` (mặc định trả về Abi generic -> unknown).
 */
const charityLedgerAbi = [
  {
    type: "function",
    name: "recordCommitment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "campaignId", type: "string" },
      { name: "commitment", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getRecord",
    stateMutability: "view",
    inputs: [{ name: "campaignId", type: "string" }],
    outputs: [
      { name: "commitment", type: "bytes32" },
      { name: "timestamp", type: "uint256" },
      { name: "recordedBy", type: "address" },
    ],
  },
  {
    type: "function",
    name: "records",
    stateMutability: "view",
    inputs: [{ name: "", type: "string" }],
    outputs: [
      { name: "commitment", type: "bytes32" },
      { name: "timestamp", type: "uint256" },
      { name: "recordedBy", type: "address" },
    ],
  },
] as const;

type CampaignRecordTuple = readonly [
  commitment: `0x${string}`,
  timestamp: bigint,
  recordedBy: `0x${string}`,
];
type CampaignRecord = {
  commitment: `0x${string}`;
  timestamp: bigint;
  recordedBy: `0x${string}`;
};

type CharityLedgerContract = {
  address: `0x${string}`;
  abi: typeof charityLedgerAbi;
  read: {
    getRecord: (args: [string]) => Promise<CampaignRecordTuple>;
    records: (args: [string]) => Promise<CampaignRecordTuple>;
  };
  write: {
    recordCommitment: (
      args: [string, `0x${string}`],
      options?: { account?: `0x${string}` },
    ) => Promise<`0x${string}`>;
  };
};

function makeCommitment(hexPair: string): `0x${string}` {
  assert.equal(hexPair.length, 2, "hexPair phải là 2 ký tự hex");
  return ("0x" + hexPair.repeat(32)) as `0x${string}`;
}

function toRecord(tuple: CampaignRecordTuple): CampaignRecord {
  const [commitment, timestamp, recordedBy] = tuple;
  return { commitment, timestamp, recordedBy };
}

async function deployCharityLedger(): Promise<{
  charityLedger: CharityLedgerContract;
  deployer: `0x${string}`;
  walletClients: Awaited<ReturnType<typeof hre.viem.getWalletClients>>;
}> {
  const deployed = await hre.viem.deployContract("CharityLedger");
  const charityLedger = deployed as unknown as CharityLedgerContract;
  const walletClients = await hre.viem.getWalletClients();
  const deployer = walletClients[0].account.address as `0x${string}`;
  return { charityLedger, deployer, walletClients };
}

describe("CharityLedger Smart Contract", function () {
  it("should record commitment successfully", async function () {
    const { charityLedger, deployer } = await deployCharityLedger();
    const campaignId = "CAMPAIGN-001";
    const commitment = makeCommitment("ab");

    await charityLedger.write.recordCommitment([campaignId, commitment]);

    const saved = toRecord(
      await charityLedger.read.getRecord([campaignId]),
    );

    assert.equal(saved.commitment, commitment);
    assert.ok(saved.timestamp > 0n, "timestamp phải > 0");
    assert.equal(
      saved.recordedBy.toLowerCase(),
      deployer.toLowerCase(),
      "recordedBy phải là địa chỉ deployer / wallet mặc định",
    );
    assert.ok(saved.recordedBy.startsWith("0x"));
  });

  it("should store record independently per campaignId", async function () {
    const { charityLedger } = await deployCharityLedger();
    const campaignA = "CAMPAIGN-A";
    const campaignB = "CAMPAIGN-B";
    const commitmentA = makeCommitment("aa");
    const commitmentB = makeCommitment("bb");

    await charityLedger.write.recordCommitment([campaignA, commitmentA]);
    await charityLedger.write.recordCommitment([campaignB, commitmentB]);

    const recordA = toRecord(await charityLedger.read.getRecord([campaignA]));
    const recordB = toRecord(await charityLedger.read.getRecord([campaignB]));

    assert.equal(recordA.commitment, commitmentA);
    assert.equal(recordB.commitment, commitmentB);
    assert.ok(recordA.timestamp > 0n);
    assert.ok(recordB.timestamp > 0n);
    assert.ok(recordB.timestamp >= recordA.timestamp);
  });

  it("should be readable via public mapping records()", async function () {
    const { charityLedger } = await deployCharityLedger();
    const campaignId = "CAMPAIGN-MAP";
    const commitment = makeCommitment("cd");

    await charityLedger.write.recordCommitment([campaignId, commitment]);

    const viaGetRecord = toRecord(
      await charityLedger.read.getRecord([campaignId]),
    );
    const viaMapping = toRecord(
      await charityLedger.read.records([campaignId]),
    );

    assert.equal(viaMapping.commitment, viaGetRecord.commitment);
    assert.equal(viaMapping.timestamp, viaGetRecord.timestamp);
    assert.equal(viaMapping.recordedBy, viaGetRecord.recordedBy);
  });

  it("should revert if recording duplicate campaignId", async function () {
    const { charityLedger } = await deployCharityLedger();
    const campaignId = "CAMPAIGN-002";
    const commitment = makeCommitment("cd");

    await charityLedger.write.recordCommitment([campaignId, commitment]);

    await assert.rejects(
      async () => {
        await charityLedger.write.recordCommitment([campaignId, commitment]);
      },
      (err: Error) => {
        const msg = err.message ?? "";
        // viem có thể bọc lỗi custom thành ContractFunctionExecutionError / revert reason
        assert.ok(
          msg.includes("RecordAlreadyExists") ||
            msg.includes("already") ||
            msg.includes("revert"),
          `Lý do revert phải nhắc RecordAlreadyExists, thực tế: ${msg}`,
        );
        return true;
      },
    );

    // Đảm bảo record gốc không bị ghi đè
    const saved = toRecord(await charityLedger.read.getRecord([campaignId]));
    assert.equal(saved.commitment, commitment);
  });

  it("should revert when commitment is zero bytes32 (InvalidCommitment)", async function () {
    const { charityLedger } = await deployCharityLedger();
    const campaignId = "CAMPAIGN-ZERO";
    const zeroCommitment = ("0x" + "00".repeat(32)) as `0x${string}`;

    await assert.rejects(
      async () => {
        await charityLedger.write.recordCommitment([campaignId, zeroCommitment]);
      },
      (err: Error) => {
        const msg = err.message ?? "";
        assert.ok(
          msg.includes("InvalidCommitment") ||
            msg.includes("Invalid") ||
            msg.includes("revert"),
          `Lý do revert phải nhắc InvalidCommitment, thực tế: ${msg}`,
        );
        return true;
      },
    );

    // Chưa ghi gì nên timestamp = 0
    const saved = toRecord(await charityLedger.read.getRecord([campaignId]));
    assert.equal(saved.timestamp, 0n);
    assert.equal(saved.commitment, zeroCommitment);
  });

  it("should return zero values for non-existent campaignId", async function () {
    const { charityLedger } = await deployCharityLedger();
    const saved = toRecord(
      await charityLedger.read.getRecord(["NOT-FOUND"]),
    );

    assert.equal(saved.commitment, ("0x" + "00".repeat(32)) as `0x${string}`);
    assert.equal(saved.timestamp, 0n);
    assert.equal(
      saved.recordedBy,
      "0x0000000000000000000000000000000000000000",
    );
  });

  it("should record with the correct sender (walletClients[1])", async function () {
    const { charityLedger, walletClients } = await deployCharityLedger();
    assert.ok(walletClients.length >= 2, "Hardhat phải có >= 2 wallet clients");

    const campaignId = "CAMPAIGN-SENDER";
    const commitment = makeCommitment("ef");
    const senderAddress = walletClients[1].account.address as `0x${string}`;

    await charityLedger.write.recordCommitment([campaignId, commitment], {
      account: senderAddress,
    });

    const saved = toRecord(await charityLedger.read.getRecord([campaignId]));
    assert.equal(saved.commitment, commitment);
    assert.equal(
      saved.recordedBy.toLowerCase(),
      senderAddress.toLowerCase(),
      "recordedBy phải trùng với sender = walletClients[1]",
    );
  });
});
