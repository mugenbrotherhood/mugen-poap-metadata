require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Animechain Testnet (keep for testing)
    animechain_testnet: {
      url: "https://6900.rpc.thirdweb.com",
      chainId: 6900,
      accounts: [process.env.PRIVATE_KEY],
    },
    // Animechain Mainnet
    animechain_mainnet: {
      url: "https://rpc-animechain-39xf6m45e3.t.conduit.xyz",
      chainId: 69000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

