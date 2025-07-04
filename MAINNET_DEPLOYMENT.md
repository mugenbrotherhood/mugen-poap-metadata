# Animechain Mainnet Deployment Guide

## Prerequisites Checklist

### ✅ Network Configuration
- [x] Updated hardhat.config.js with mainnet settings
- [x] **RPC URL FOUND**: `https://rpc-animechain-39xf6m45e3.t.conduit.xyz`
- [x] Chain ID 69000 confirmed
- [ ] Test connection to mainnet RPC

### ✅ Wallet & Funding
- [ ] Ensure your wallet has ANIME tokens for gas fees
- [ ] Verify you're using the correct private key for mainnet
- [ ] **NEVER use testnet private keys on mainnet**
- [ ] Check balance: `npx hardhat run scripts/check-balance.js --network animechain_mainnet`

### ✅ Smart Contract Review
- [ ] Final code review of contracts/mugenpoap.sol
- [x] **MAX_SUPPLY = 30** tokens confirmed
- [x] **1 mint per wallet** limit implemented via `hasClaimed` mapping
- [ ] Confirm metadata URI is final
- [ ] Test all functions on testnet first

### ✅ Deployment Parameters
- [x] **Mint timing**: Friday July 4th, 2025 at 10:00 PM ET → Saturday July 5th, 2025 at 11:00 PM ET (25 hours)
- [x] **Max supply**: 30 tokens total
- [x] **Per-wallet limit**: 1 token per address
- [x] Token name: "Mugen POAP"
- [x] Token symbol: "MPOAP"
- [x] Base URI: `ipfs://bafkreihxvkbqqj24zw72dmk54ws2f7pdusvo75bigukeh4nttg4tgw2hs4`

## Required Actions

### 1. ✅ Animechain Mainnet RPC URL Found
- **RPC URL**: `https://rpc-animechain-39xf6m45e3.t.conduit.xyz`
- **Explorer**: https://explorer-animechain-39xf6m45e3.t.conduit.xyz/
- **Chain ID**: 69000

### 2. Update .env File
```bash
# Make sure you have the mainnet private key
PRIVATE_KEY=your_mainnet_private_key_here
```

### 3. Get ANIME Tokens
- You'll need ANIME tokens for gas fees
- Check faucets or exchanges that support Animechain

## Deployment Commands

### Test Connection First
```bash
npx hardhat run scripts/check-balance.js --network animechain_mainnet
# OR
npm run check-balance:mainnet
```

### Deploy to Mainnet
```bash
npx hardhat run scripts/deploy.js --network animechain_mainnet
# OR
npm run deploy:mainnet
```

### Verify Contract (after deployment)
```bash
npx hardhat verify --network animechain_mainnet [CONTRACT_ADDRESS] "Mugen POAP" "MPOAP" "[BASE_URI]" [MINT_START] [MINT_END]
```

## Post-Deployment

### ✅ Verification Steps
- [ ] Contract deployed successfully
- [ ] Verify on https://explorer-animechain-39xf6m45e3.t.conduit.xyz/
- [ ] Test mint function (should allow 1 per wallet, max 30 total)
- [ ] Test admin functions
- [ ] Set up signature generation for reserved POAPs

### ✅ Documentation
- [ ] Save contract address
- [ ] Document deployment transaction hash
- [ ] Update frontend/app with mainnet contract address
- [ ] Share contract address with team

## Security Notes

⚠️ **CRITICAL**: 
- Never share private keys
- Test everything on testnet first
- Double-check all parameters before mainnet deployment
- The contract is immutable once deployed
- You cannot change MAX_SUPPLY, name, or symbol after deployment
- **NEW**: Max supply is now 30 tokens (reduced from 50)

## Troubleshooting

### Common Issues:
1. **Insufficient funds**: Get more ANIME tokens
2. **RPC errors**: Network might be experiencing issues
3. **Gas estimation failed**: Check contract code and parameters
4. **Transaction reverted**: Verify all constructor parameters
5. **"Already claimed"**: Each wallet can only mint 1 token
6. **"Max supply reached"**: Only 30 tokens total can be minted

### Need Help?
- Check Animechain documentation
- Ask in community channels
- Review deployment logs for specific errors 