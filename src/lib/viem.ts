import { createPublicClient, http } from "viem";
import { sepolia, hardhat } from "viem/chains";

const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
const isLocal = rpcUrl.includes("127.0.0.1") || rpcUrl.includes("localhost");

export const publicClient = createPublicClient({
  chain: isLocal ? hardhat : sepolia,
  transport: http(rpcUrl),
});


