async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Replace with your deployed contract address
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("Contract address:", poap.target);
  console.log("Max supply:", await poap.MAX_SUPPLY());
  console.log("Next token ID:", await poap.nextTokenId());
  console.log("Owner:", await poap.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 