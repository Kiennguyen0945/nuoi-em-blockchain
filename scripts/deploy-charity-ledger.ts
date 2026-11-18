import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  const recorder = process.env.BLOCKCHAIN_WALLET_ADDRESS
    ?? deployer.account.address;
  const charityLedger = await hre.viem.deployContract("CharityLedger", [
    recorder as `0x${string}`,
  ]);
  console.log(`CharityLedger deployed at ${charityLedger.address}`);
  console.log(`Authorized recorder: ${recorder}`);
  console.log("Copy this address to CHARITY_LEDGER_CONTRACT_ADDRESS in .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
