import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia, hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
const isLocal = rpcUrl.includes("127.0.0.1") || rpcUrl.includes("localhost");
export const blockchainChain = isLocal ? hardhat : sepolia;

export const publicClient = createPublicClient({
  chain: blockchainChain,
  transport: http(rpcUrl),
});

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
] as const;

function envAddress(): `0x${string}` {
  const value = process.env.CHARITY_LEDGER_CONTRACT_ADDRESS
    ?? process.env.NEXT_PUBLIC_CHARITY_LEDGER_CONTRACT_ADDRESS;
  if (!value || !/^0x[0-9a-fA-F]{40}$/.test(value)) {
    throw new Error("Missing or invalid CHARITY_LEDGER_CONTRACT_ADDRESS");
  }
  return value as `0x${string}`;
}

function envPrivateKey(): `0x${string}` {
  const value = process.env.BLOCKCHAIN_PRIVATE_KEY ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!value) throw new Error("Missing BLOCKCHAIN_PRIVATE_KEY or DEPLOYER_PRIVATE_KEY");
  const normalized = value.startsWith("0x") ? value : `0x${value}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("Blockchain private key must contain 32 bytes");
  }
  return normalized as `0x${string}`;
}

/** Ghi commitment lên CharityLedger và đợi transaction được mined. */
export async function recordCommitmentOnChain(campaignId: string, commitment: `0x${string}`) {
  const account = privateKeyToAccount(envPrivateKey());
  const walletClient = createWalletClient({
    account,
    chain: blockchainChain,
    transport: http(rpcUrl),
  });
  const hash = await walletClient.writeContract({
    address: envAddress(),
    abi: charityLedgerAbi,
    functionName: "recordCommitment",
    args: [campaignId, commitment],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error("Blockchain transaction reverted");
  return { hash, recordedBy: account.address };
}


