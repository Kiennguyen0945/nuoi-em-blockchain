import hre from "hardhat";

async function main() {
  const charityLedger = await hre.viem.deployContract("CharityLedger");
  console.log(`CharityLedger deployed at ${charityLedger.address}`);
  console.log("Copy this address to CHARITY_LEDGER_CONTRACT_ADDRESS in .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
