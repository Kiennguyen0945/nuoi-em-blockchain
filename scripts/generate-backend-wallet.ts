import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log("Backend wallet created successfully.");
console.log("");
console.log("Add these values to your local .env file:");
console.log(`BLOCKCHAIN_PRIVATE_KEY=${privateKey}`);
console.log(`BLOCKCHAIN_WALLET_ADDRESS=${account.address}`);
console.log("");
console.log("Never commit BLOCKCHAIN_PRIVATE_KEY to Git or expose it to the frontend.");
