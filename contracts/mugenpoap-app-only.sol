// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MugenPOAPAppOnly is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasClaimed;

    string private _customBaseURI;
    uint256 public mintStart;
    uint256 public mintEnd;

    // Signature-based claiming state variables
    mapping(address => bool) public hasClaimedReservation;
    mapping(bytes32 => bool) public usedSignatures;
    address public admin;

    // Event for tracking claims
    event POAPClaimed(address indexed user, uint256 indexed tokenId, uint256 indexed reservationId);

    uint256 public constant MAX_SUPPLY = 50;

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
        admin = msg.sender;
    }

    // REMOVED: public mint() function - no direct minting allowed!
    
    // ONLY way to mint: through app with admin signature
    function claimPOAP(
        uint256 reservationId,
        bytes memory signature
    ) external {
        // Create message hash from sender address and reservation ID
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, reservationId));
        
        // Create signature hash to track usage
        bytes32 signatureHash = keccak256(signature);
        
        // Security checks
        require(block.timestamp >= mintStart && block.timestamp <= mintEnd, "Not minting period");
        require(!usedSignatures[signatureHash], "Signature already used");
        require(verifySignature(messageHash, signature), "Invalid admin signature");
        require(!hasClaimed[msg.sender], "Address already claimed");
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        
        // Mark signature as used and address as claimed
        usedSignatures[signatureHash] = true;
        hasClaimed[msg.sender] = true;
        
        // Mint the token
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        // Emit event for tracking
        emit POAPClaimed(msg.sender, tokenId, reservationId);
    }

    // Helper function for ECDSA signature recovery
    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

    // Function to verify admin signatures
    function verifySignature(bytes32 messageHash, bytes memory signature) internal view returns (bool) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        return recoverSigner(ethSignedMessageHash, signature) == admin;
    }

    // View functions
    function canClaim(address user) external view returns (bool) {
        return !hasClaimed[user] && 
               block.timestamp >= mintStart && 
               block.timestamp <= mintEnd &&
               nextTokenId < MAX_SUPPLY;
    }

    // Admin functions
    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
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

    // Emergency mint function (owner only, for special cases)
    function emergencyMint(address to) external onlyOwner {
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        _safeMint(to, nextTokenId++);
        hasClaimed[to] = true;
    }
} 