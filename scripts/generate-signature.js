const { ethers } = require("hardhat");

async function generateSignature() {
  // This would run on your backend/server
  const [admin] = await ethers.getSigners();
  console.log("Admin address:", admin.address);
  
  // Example: User wants to claim POAP  
  const userAddress = ethers.getAddress("0x742d35cc6635c0532925a3b8d0df4def8c4e4567"); // User's wallet address
  const reservationId = 12345; // Unique ID for this reservation
  
  // Create message hash
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [userAddress, reservationId]
  );
  
  console.log("\n=== Signature Generation ===");
  console.log("User address:", userAddress);
  console.log("Reservation ID:", reservationId);
  console.log("Message hash:", messageHash);
  
  // Sign the message hash
  const signature = await admin.signMessage(ethers.getBytes(messageHash));
  console.log("Signature:", signature);
  
  console.log("\n=== How it works ===");
  console.log("1. User visits your app and connects wallet");
  console.log("2. User requests to claim POAP");
  console.log("3. Your backend validates the user (event attendance, etc.)");
  console.log("4. Backend generates signature with admin private key");
  console.log("5. Frontend calls claimPOAP(reservationId, signature)");
  console.log("6. Smart contract verifies signature came from admin");
  console.log("7. If valid, POAP is minted to user");
  
  console.log("\n=== Backend API Example ===");
  console.log(`
POST /api/claim-signature
{
  "userAddress": "${userAddress}",
  "eventCode": "MUGEN2024", // Your event verification
  "email": "user@example.com" // Additional validation
}

Response:
{
  "reservationId": ${reservationId},
  "signature": "${signature}",
  "expiresAt": 1640995200 // Optional expiry
}
  `);
  
  return { reservationId, signature, userAddress };
}

// Test signature verification
async function verifySignature(userAddress, reservationId, signature) {
  const [admin] = await ethers.getSigners();
  
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [userAddress, reservationId]
  );
  
  const ethSignedMessageHash = ethers.solidityPackedKeccak256(
    ["string", "bytes32"],
    ["\x19Ethereum Signed Message:\n32", messageHash]
  );
  
  const recoveredAddress = ethers.recoverAddress(ethSignedMessageHash, signature);
  
  console.log("\n=== Signature Verification ===");
  console.log("Expected admin:", admin.address);
  console.log("Recovered address:", recoveredAddress);
  console.log("Valid signature:", recoveredAddress.toLowerCase() === admin.address.toLowerCase());
}

async function main() {
  const { reservationId, signature, userAddress } = await generateSignature();
  await verifySignature(userAddress, reservationId, signature);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 