async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking minters with:", deployer.address);

  const contractAddress = "0x09420b7de82D258a73bf39AbEFeC6b88151A7c7F";
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("=== POAP Minting Activity ===");
  console.log("Contract Address:", poap.target);
  console.log("Total Supply:", await poap.nextTokenId());
  
  // Get all Transfer events (minting events)
  try {
    const filter = poap.filters.Transfer(null, null, null);
    const events = await poap.queryFilter(filter);
    
    console.log("\n=== Minted Tokens ===");
    if (events.length === 0) {
      console.log("No tokens have been minted yet.");
    } else {
      console.log(`Found ${events.length} minting events:`);
      
      for (const event of events) {
        const tokenId = event.args.tokenId;
        const to = event.args.to;
        const from = event.args.from;
        
        // Skip if it's not a mint (from address 0x0)
        if (from === "0x0000000000000000000000000000000000000000") {
          console.log(`Token ID ${tokenId}: ${to}`);
          
          // Check additional claim status
          const hasClaimed = await poap.hasClaimed(to);
          const hasClaimedReservation = await poap.hasClaimedReservation(to);
          console.log(`  - Has Claimed: ${hasClaimed}`);
          console.log(`  - Has Claimed Reservation: ${hasClaimedReservation}`);
        }
      }
    }
  } catch (error) {
    console.log("Error fetching Transfer events:", error.message);
  }

  // Check reservation claims
  try {
    console.log("\n=== Reservation Claims ===");
    const reservationFilter = poap.filters.ReservationClaimed(null, null);
    const reservationEvents = await poap.queryFilter(reservationFilter);
    
    if (reservationEvents.length === 0) {
      console.log("No reservation claims found.");
    } else {
      console.log(`Found ${reservationEvents.length} reservation claims:`);
      for (const event of reservationEvents) {
        console.log(`User: ${event.args.user}, Reservation ID: ${event.args.reservationId}`);
      }
    }
  } catch (error) {
    console.log("Error fetching ReservationClaimed events:", error.message);
  }

  // Check specific addresses if needed
  console.log("\n=== Quick Status Check ===");
  const addresses = [deployer.address]; // Add more addresses to check here
  
  for (const address of addresses) {
    console.log(`\nAddress: ${address}`);
    console.log(`  Has Claimed: ${await poap.hasClaimed(address)}`);
    console.log(`  Can Claim Reservation: ${await poap.canClaimReservation(address)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 