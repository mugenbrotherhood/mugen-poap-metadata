// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MugenPOAPAllowlist is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public allowlist; // Only these addresses can mint

    string private _customBaseURI;
    uint256 public mintStart;
    uint256 public mintEnd;
    uint256 public constant MAX_SUPPLY = 50;

    event AddedToAllowlist(address indexed user);
    event RemovedFromAllowlist(address indexed user);
    event POAPClaimed(address indexed user, uint256 indexed tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        uint256 _mintStart,
        uint256 _mintEnd
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(_mintEnd > _mintStart, "Invalid mint window");
        _customBaseURI = baseURI_;
        mintStart = _mintStart;
        mintEnd = _mintEnd;
    }

    // Modified mint function - only allowlisted addresses can mint
    function mint() external {
        require(block.timestamp >= mintStart && block.timestamp <= mintEnd, "Not minting period");
        require(allowlist[msg.sender], "Not on allowlist"); // 🔒 KEY RESTRICTION
        require(!hasClaimed[msg.sender], "Already claimed");
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        
        _safeMint(msg.sender, nextTokenId++);
        hasClaimed[msg.sender] = true;
        
        emit POAPClaimed(msg.sender, nextTokenId - 1);
    }

    // Admin functions to manage allowlist
    function addToAllowlist(address user) external onlyOwner {
        allowlist[user] = true;
        emit AddedToAllowlist(user);
    }

    function addMultipleToAllowlist(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            allowlist[users[i]] = true;
            emit AddedToAllowlist(users[i]);
        }
    }

    function removeFromAllowlist(address user) external onlyOwner {
        allowlist[user] = false;
        emit RemovedFromAllowlist(user);
    }

    function isAllowlisted(address user) external view returns (bool) {
        return allowlist[user];
    }

    function canMint(address user) external view returns (bool) {
        return allowlist[user] && 
               !hasClaimed[user] && 
               block.timestamp >= mintStart && 
               block.timestamp <= mintEnd &&
               nextTokenId < MAX_SUPPLY;
    }

    function _baseURI() internal view override returns (string memory) {
        return _customBaseURI;
    }

    function updateBaseURI(string memory newBaseURI) external onlyOwner {
        _customBaseURI = newBaseURI;
    }

    function updateMintWindow(uint256 _start, uint256 _end) external onlyOwner {
        require(_end > _start, "Invalid window");
        mintStart = _start;
        mintEnd = _end;
    }

    // Emergency mint function (owner only)
    function emergencyMint(address to) external onlyOwner {
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        _safeMint(to, nextTokenId++);
        hasClaimed[to] = true;
    }
} 