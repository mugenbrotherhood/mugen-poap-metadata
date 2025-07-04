async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing contract with:", deployer.address);

  const contractAddress = "0x09420b7de82D258a73bf39AbEFeC6b88151A7c7F";
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("=== Contract Information ===");
  console.log("Contract Address:", poap.target);
  console.log("Name:", await poap.name());
  console.log("Symbol:", await poap.symbol());
  console.log("Max Supply:", await poap.MAX_SUPPLY());
  console.log("Next Token ID:", await poap.nextTokenId());
  console.log("Owner:", await poap.owner());
  console.log("Admin:", await poap.admin());
  
  console.log("\n=== Minting Window ===");
  const mintStart = await poap.mintStart();
  const mintEnd = await poap.mintEnd();
  const now = Math.floor(Date.now() / 1000);
  
  console.log("Mint Start:", new Date(Number(mintStart) * 1000).toLocaleString());
  console.log("Mint End:", new Date(Number(mintEnd) * 1000).toLocaleString());
  console.log("Current Time:", new Date(now * 1000).toLocaleString());
  console.log("Minting Active:", now >= mintStart && now <= mintEnd);
  
  console.log("\n=== Metadata ===");
  console.log("Base URI:", await poap._baseURI());
  
  console.log("\n=== Claim Status ===");
  console.log("Has Claimed (your address):", await poap.hasClaimed(deployer.address));
  console.log("Can Claim Reservation:", await poap.canClaimReservation(deployer.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 