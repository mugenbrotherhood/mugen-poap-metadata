async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Updating mint window with:", deployer.address);
  
  // You'll need to replace this with your actual deployed contract address
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    console.error("Example: CONTRACT_ADDRESS=0x... npx hardhat run scripts/update-mint-window.js --network animechain_mainnet");
    process.exit(1);
  }

  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);
  
  // Phase 2 timing - July 4th-5th, 2025
  const phase2Start = Math.floor(new Date('2025-07-05T02:00:00.000Z').getTime() / 1000);
  const phase2End = Math.floor(new Date('2025-07-06T03:00:00.000Z').getTime() / 1000);
  
  // Convert to readable dates
  const startDateET = new Date(phase2Start * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const endDateET = new Date(phase2End * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  console.log("\n=== UPDATING TO PHASE 2: MAIN EVENT ===");
  console.log("New mint START (ET):", startDateET);
  console.log("New mint END (ET):", endDateET);
  console.log("New mint START (UTC):", new Date(phase2Start * 1000).toISOString());
  console.log("New mint END (UTC):", new Date(phase2End * 1000).toISOString());
  console.log("Duration:", Math.floor((phase2End - phase2Start) / 3600), "hours");
  
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
  
  // Update mint window
  console.log("\n🔄 Updating mint window...");
  const tx = await poap.updateMintWindow(phase2Start, phase2End);
  console.log("Transaction hash:", tx.hash);
  
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();
  
  console.log("✅ Mint window updated successfully!");
  
  // Verify the update
  const newStart = await poap.mintStart();
  const newEnd = await poap.mintEnd();
  console.log("\n=== VERIFICATION ===");
  console.log("New mint start:", new Date(Number(newStart) * 1000).toISOString());
  console.log("New mint end:", new Date(Number(newEnd) * 1000).toISOString());
  
  console.log("\n🎉 Ready for Phase 2: July 4th-5th Main Event!");
  console.log("Explorer:", `https://explorer-animechain-39xf6m45e3.t.conduit.xyz/address/${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 