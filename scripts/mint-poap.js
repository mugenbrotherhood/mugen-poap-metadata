async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting POAP with:", deployer.address);

  const contractAddress = "0x09420b7de82D258a73bf39AbEFeC6b88151A7c7F";
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("Attempting to mint POAP...");
  
  try {
    // Check if already claimed
    const hasClaimed = await poap.hasClaimed(deployer.address);
    if (hasClaimed) {
      console.log("❌ You have already claimed a POAP!");
      return;
    }

    // Check if minting is active
    const now = Math.floor(Date.now() / 1000);
    const mintStart = await poap.mintStart();
    const mintEnd = await poap.mintEnd();
    
    if (now < mintStart || now > mintEnd) {
      console.log("❌ Minting is not currently active!");
      console.log("Mint window:", new Date(Number(mintStart) * 1000), "to", new Date(Number(mintEnd) * 1000));
      return;
    }

    // Check supply
    const nextTokenId = await poap.nextTokenId();
    const maxSupply = await poap.MAX_SUPPLY();
    
    if (nextTokenId >= maxSupply) {
      console.log("❌ Max supply reached!");
      return;
    }

    // Mint the POAP
    console.log("Minting token ID:", nextTokenId.toString());
    const tx = await poap.mint();
    console.log("Transaction submitted:", tx.hash);
    
    await tx.wait();
    console.log("✅ Successfully minted POAP!");
    console.log("Token ID:", nextTokenId.toString());
    console.log("Transaction confirmed:", tx.hash);
    
  } catch (error) {
    console.error("❌ Minting failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 