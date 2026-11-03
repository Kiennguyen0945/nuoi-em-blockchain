import { formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient } from "../src/lib/viem";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Checking blockchain node connection...");
  const blockNumber = await publicClient.getBlockNumber();
  console.log(` Connected! Current Block Number: ${blockNumber}`);

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (privateKey) {
    const formattedKey = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`;
    const account = privateKeyToAccount(formattedKey);
    const balance = await publicClient.getBalance({ address: account.address });
    console.log(` Account Address: ${account.address}`);
    console.log(` Balance: ${formatEther(balance)} ETH`);
  }
}

main().catch((err) => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});

