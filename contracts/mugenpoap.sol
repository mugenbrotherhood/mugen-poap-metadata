// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MugenPOAP is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasClaimed;

    string private _customBaseURI;
    uint256 public mintStart;
    uint256 public mintEnd;

    // New state variables for signature-based claiming
    mapping(address => bool) public hasClaimedReservation;
    mapping(bytes32 => bool) public usedSignatures;
    address public admin;

    // Event for tracking reservation claims
    event ReservationClaimed(address indexed user, uint256 indexed reservationId);

    // Updated max supply to 30 tokens
    uint256 public constant MAX_SUPPLY = 30;

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
        admin = msg.sender; // Set deployer as admin initially
    }

    function mint() external {
        require(block.timestamp >= mintStart && block.timestamp <= mintEnd, "Not minting period");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        _safeMint(msg.sender, nextTokenId++);
        hasClaimed[msg.sender] = true;
    }

    // Main function for claiming reserved POAPs with signature verification
    function claimReservedPOAP(
        uint256 reservationId,
        bytes memory signature
    ) external {
        // Create message hash from sender address and reservation ID
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, reservationId));
        
        // Create signature hash to track usage
        bytes32 signatureHash = keccak256(signature);
        
        // Security checks
        require(!usedSignatures[signatureHash], "Signature already used");
        require(verifySignature(messageHash, signature), "Invalid admin signature");
        require(!hasClaimedReservation[msg.sender], "Address already claimed reservation");
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(block.timestamp >= mintStart && block.timestamp <= mintEnd, "Not minting period");
        
        // Mark signature as used and address as claimed
        usedSignatures[signatureHash] = true;
        hasClaimedReservation[msg.sender] = true;
        hasClaimed[msg.sender] = true;
        
        // Emit event for tracking
        emit ReservationClaimed(msg.sender, reservationId);
        
        // Mint the token directly instead of calling mint()
        _safeMint(msg.sender, nextTokenId++);
    }

    // Helper function for ECDSA signature recovery
    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return address(0);
        }

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
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

    // View function for frontend to check claim status
    function canClaimReservation(address user) external view returns (bool) {
        return !hasClaimedReservation[user];
    }

    // Function to update admin address
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
}
