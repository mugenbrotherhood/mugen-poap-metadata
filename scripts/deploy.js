async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const POAP = await ethers.getContractFactory("MugenPOAP");

  // Using your IPFS hash - this points to a single metadata file
  // All tokens will have the same metadata
  const baseURI = "ipfs://bafkreihxvkbqqj24zw72dmk54ws2f7pdusvo75bigukeh4nttg4tgw2hs4";
  
  // PHASE 1: Early access window - 8 hours starting in 30 minutes
  const mintStart = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now
  const mintEnd = mintStart + 8 * 60 * 60; // 8 hours duration

  // Convert back to readable dates for verification
  const startDateET = new Date(mintStart * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const endDateET = new Date(mintEnd * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York", 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  console.log("\n=== PHASE 1: EARLY ACCESS MINT TIMING ===");
  console.log("Mint START (ET):", startDateET);
  console.log("Mint END (ET):", endDateET);
  console.log("Mint START (UTC):", new Date(mintStart * 1000).toISOString());
  console.log("Mint END (UTC):", new Date(mintEnd * 1000).toISOString());
  console.log("Duration:", Math.floor((mintEnd - mintStart) / 3600), "hours");

  const poap = await POAP.deploy("Mugen POAP", "MPOAP", baseURI, mintStart, mintEnd);

  await poap.waitForDeployment();

  const contractAddress = poap.target;
  console.log("\n=== DEPLOYMENT SUCCESS ===");
  console.log("MugenPOAP deployed to:", contractAddress);
  console.log("Metadata base URI:", baseURI);
  console.log("Max supply:", "30");
  console.log("Mint limit per wallet:", "1");
  console.log("Contract owner:", await poap.owner());
  console.log("Admin address:", await poap.admin());
  
  // Save deployment info
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await deployer.provider.getNetwork()).name);
  console.log("Chain ID:", (await deployer.provider.getNetwork()).chainId);
  console.log("Explorer URL:", `https://explorer-animechain-39xf6m45e3.t.conduit.xyz/address/${contractAddress}`);
  
  // Calculate Phase 2 timing (July 4th-6th)
  const phase2Start = Math.floor(new Date('2025-07-05T02:00:00.000Z').getTime() / 1000);
  const phase2End = Math.floor(new Date('2025-07-06T07:00:00.000Z').getTime() / 1000);
  
  console.log("\n=== PHASE 2: MAIN EVENT SETUP ===");
  console.log("After Phase 1 ends, run this command to update mint window:");
  console.log(`npx hardhat run scripts/update-mint-window.js --network animechain_mainnet`);
  console.log("");
  console.log("Phase 2 will be:");
  console.log("Start: Friday July 4th, 2025 at 10:00 PM ET");
  console.log("End: Sunday July 6th, 2025 at 3:00 AM ET");
  console.log("Unix timestamps:", phase2Start, "to", phase2End);
  
  // Verify contract parameters
  console.log("\n=== CONTRACT VERIFICATION ===");
  console.log("Run this command to verify on explorer:");
  console.log(`npx hardhat verify --network animechain_mainnet ${contractAddress} "Mugen POAP" "MPOAP" "${baseURI}" ${mintStart} ${mintEnd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
