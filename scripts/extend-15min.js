async function main() {
  const [deployer] = await ethers.getSigners();
  
  const contractAddress = "0x50F296a5E8eDA6Ae4d24663de36411876d705749";
  
  console.log("=== CURRENT CONTRACT MINT WINDOW ===\n");
  console.log("Contract Address:", contractAddress);
  console.log("Querying with:", deployer.address);
  
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);
  
  try {
    // Get current mint window from contract
    const mintStart = await poap.mintStart();
    const mintEnd = await poap.mintEnd();
    const nextTokenId = await poap.nextTokenId();
    const maxSupply = await poap.MAX_SUPPLY();
    
    // Convert to readable dates
    const startDateET = new Date(Number(mintStart) * 1000).toLocaleString("en-US", {
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
    
    const endDateET = new Date(Number(mintEnd) * 1000).toLocaleString("en-US", {
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
    
    console.log("📅 CURRENT MINT WINDOW:");
    console.log("   Start (ET):", startDateET);
    console.log("   End (ET):  ", endDateET);
    console.log("");
    console.log("🌐 UTC TIMES:");
    console.log("   Start UTC:", new Date(Number(mintStart) * 1000).toISOString());
    console.log("   End UTC:  ", new Date(Number(mintEnd) * 1000).toISOString());
    console.log("");
    console.log("📊 SUPPLY STATUS:");
    console.log("   Current supply:", nextTokenId.toString());
    console.log("   Max supply:", maxSupply.toString());
    console.log("");
    
    // Check current status
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(mintStart);
    const endTime = Number(mintEnd);
    
    if (now < startTime) {
      const timeUntilStart = startTime - now;
      const hoursUntilStart = Math.floor(timeUntilStart / 3600);
      const minutesUntilStart = Math.floor((timeUntilStart % 3600) / 60);
      console.log("⏰ STATUS: Mint window is CLOSED");
      console.log(`   Opens in: ${hoursUntilStart}h ${minutesUntilStart}m`);
    } else if (now <= endTime) {
      const timeRemaining = endTime - now;
      const hoursRemaining = Math.floor(timeRemaining / 3600);
      const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);
      console.log("✅ STATUS: Mint window is OPEN");
      console.log(`   Closes in: ${hoursRemaining}h ${minutesRemaining}m`);
    } else {
      console.log("🔴 STATUS: Mint window is CLOSED (ended)");
    }
    
    console.log("");
    console.log("Unix timestamps:");
    console.log("mintStart =", startTime);
    console.log("mintEnd   =", endTime);
    console.log("current   =", now);
    
  } catch (error) {
    console.error("Error querying contract:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 