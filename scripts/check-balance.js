async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await deployer.provider.getNetwork();
  
  console.log("=== WALLET & NETWORK INFO ===");
  console.log("Wallet address:", deployer.address);
  console.log("Network name:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  
  const balance = await deployer.provider.getBalance(deployer.address);
  const balanceInEther = ethers.formatEther(balance);
  
  console.log("\n=== BALANCE INFO ===");
  console.log("Balance (wei):", balance.toString());
  console.log("Balance (ANIME):", balanceInEther);
  
  // Check if balance is sufficient for deployment
  const minimumBalance = ethers.parseEther("0.1"); // 0.1 ANIME tokens
  
  if (balance < minimumBalance) {
    console.log("\n⚠️  WARNING: Low balance!");
    console.log("You may not have enough ANIME tokens for deployment.");
    console.log("Recommended minimum: 0.1 ANIME");
  } else {
    console.log("\n✅ Balance looks good for deployment!");
  }
  
  console.log("\n=== NETWORK CONNECTION ===");
  try {
    const blockNumber = await deployer.provider.getBlockNumber();
    console.log("Latest block:", blockNumber);
    console.log("✅ Successfully connected to network");
  } catch (error) {
    console.log("❌ Network connection failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 