async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Updating metadata with:", deployer.address);

  // Replace with your deployed contract address
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  // Using your IPFS hash - single metadata file for all tokens
  const newBaseURI = "ipfs://bafkreihxvkbqqj24zw72dmk54ws2f7pdusvo75bigukeh4nttg4tgw2hs4";
  
  // Alternative gateway URLs (uncomment if needed):
  // const newBaseURI = "https://gateway.pinata.cloud/ipfs/bafkreihxvkbqqj24zw72dmk54ws2f7pdusvo75bigukeh4nttg4tgw2hs4";
  // const newBaseURI = "https://ipfs.io/ipfs/bafkreihxvkbqqj24zw72dmk54ws2f7pdusvo75bigukeh4nttg4tgw2hs4";

  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("Current base URI:", await poap._baseURI());
  
  // Update the base URI (only owner can do this)
  console.log("Updating to:", newBaseURI);
  const tx = await poap.updateBaseURI(newBaseURI);
  console.log("Transaction submitted, waiting for confirmation...");
  
  await tx.wait();

  console.log("✅ Successfully updated base URI to:", newBaseURI);
  console.log("Transaction hash:", tx.hash);
  
  // Verify the update
  const updatedURI = await poap._baseURI();
  console.log("Verified new base URI:", updatedURI);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 