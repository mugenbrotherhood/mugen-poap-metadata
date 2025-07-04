async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking metadata with:", deployer.address);

  const contractAddress = "0x09420b7de82D258a73bf39AbEFeC6b88151A7c7F";
  const POAP = await ethers.getContractFactory("MugenPOAP");
  const poap = POAP.attach(contractAddress);

  console.log("=== POAP Metadata Storage ===");
  console.log("Contract Address:", poap.target);
  
  // Get the base URI
  try {
    // Since _baseURI() is internal, we need to call tokenURI for a specific token
    // or use the custom updateBaseURI function approach
    const nextTokenId = await poap.nextTokenId();
    console.log("Next Token ID:", nextTokenId.toString());
    
    if (nextTokenId > 0) {
      // If tokens exist, get metadata URI for token 0
      try {
        const tokenURI = await poap.tokenURI(0);
        console.log("Token 0 URI:", tokenURI);
        
        // Extract base URI pattern
        console.log("\n=== Metadata Location ===");
        console.log("Metadata URI:", tokenURI);
        
        if (tokenURI.startsWith("ipfs://")) {
          const ipfsHash = tokenURI.replace("ipfs://", "");
          console.log("IPFS Hash:", ipfsHash);
          console.log("IPFS Gateway URLs:");
          console.log("- https://ipfs.io/ipfs/" + ipfsHash);
          console.log("- https://gateway.pinata.cloud/ipfs/" + ipfsHash);
          console.log("- https://cloudflare-ipfs.com/ipfs/" + ipfsHash);
        }
      } catch (error) {
        console.log("Error getting tokenURI:", error.message);
      }
    } else {
      console.log("No tokens minted yet to check tokenURI");
    }

    // Check contract info
    console.log("\n=== Contract Details ===");
    console.log("Name:", await poap.name());
    console.log("Symbol:", await poap.symbol());
    console.log("Total Supply:", nextTokenId.toString());
    console.log("Max Supply:", await poap.MAX_SUPPLY());

  } catch (error) {
    console.log("Error:", error.message);
  }

  console.log("\n=== How to Access Metadata ===");
  console.log("1. Direct IPFS access:");
  console.log("   - Use any IPFS gateway with the hash");
  console.log("   - Example: https://ipfs.io/ipfs/[hash]");
  console.log("\n2. Via NFT marketplaces:");
  console.log("   - OpenSea, Rarible, etc. will automatically load metadata");
  console.log("\n3. Programmatically:");
  console.log("   - Call tokenURI(tokenId) on the contract");
  console.log("   - Fetch JSON from the returned URI");
  
  console.log("\n=== Metadata Structure (Example) ===");
  console.log("Your metadata should follow this JSON structure:");
  console.log(`{
  "name": "Token Name",
  "description": "Token Description", 
  "image": "Image URL",
  "attributes": [...]
}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 