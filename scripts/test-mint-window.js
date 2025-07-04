async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Opening test mint window with:", deployer.address);
  
  // You'll need to replace this with your actual deployed contract address
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    console.error("Example: CONTRACT_ADDRESS=0x... npx hardhat run scripts/test-mint-window.js --network animechain_mainnet");
    process.exit(1);
  }

  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);
  
  // Test timing - 30 minutes from now
  const now = Math.floor(Date.now() / 1000);
  const testStart = now; // Start immediately
  const testEnd = now + (30 * 60); // End in 30 minutes
  
  // Convert to readable dates
  const startDate = new Date(testStart * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  const endDate = new Date(testEnd * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  console.log("\n=== OPENING TEST MINT WINDOW ===");
  console.log("Test mint START (ET):", startDate);
  console.log("Test mint END (ET):", endDate);
  console.log("Test mint START (UTC):", new Date(testStart * 1000).toISOString());
  console.log("Test mint END (UTC):", new Date(testEnd * 1000).toISOString());
  console.log("Duration: 30 minutes");
  console.log("UNIX timestamps - Start:", testStart, "End:", testEnd);
  
  // Check current owner
  const owner = await poap.owner();
  console.log("\nContract owner:", owner);
  console.log("Transaction sender:", deployer.address);
  
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error("❌ You are not the contract owner!");
    process.exit(1);
  }
  
  // Get current mint window
  const currentStart = await poap.mintStart();
  const currentEnd = await poap.mintEnd();
  console.log("\nCurrent mint window:");
  console.log("Start:", new Date(Number(currentStart) * 1000).toISOString());
  console.log("End:", new Date(Number(currentEnd) * 1000).toISOString());
  
  // Check current supply
  const nextTokenId = await poap.nextTokenId();
  const maxSupply = await poap.MAX_SUPPLY();
  console.log("\nCurrent supply:", nextTokenId.toString(), "/ ", maxSupply.toString());
  
  // Update mint window
  console.log("\n🔄 Opening test mint window (30 minutes)...");
  const tx = await poap.updateMintWindow(testStart, testEnd);
  console.log("Transaction hash:", tx.hash);
  
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();
  
  console.log("✅ Test mint window opened successfully!");
  
  // Verify the update
  const newStart = await poap.mintStart();
  const newEnd = await poap.mintEnd();
  console.log("\n=== VERIFICATION ===");
  console.log("New mint start:", new Date(Number(newStart) * 1000).toISOString());
  console.log("New mint end:", new Date(Number(newEnd) * 1000).toISOString());
  
  console.log("\n🎉 Ready for testing! Mint window is open for 30 minutes.");
  console.log("Explorer:", `https://explorer-animechain-39xf6m45e3.t.conduit.xyz/address/${contractAddress}`);
  console.log("\n⏰ Window will close automatically at:", endDate);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 