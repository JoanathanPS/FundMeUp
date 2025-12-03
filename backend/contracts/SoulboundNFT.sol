// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulboundNFT
 * @dev Non-transferable identity NFTs for verified students
 * @notice Students earn this NFT upon successful verification
 * Cannot be transferred - permanently bound to student wallet
 */
contract SoulboundNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    Counters.Counter private _tokenIds;

    struct VerificationData {
        address student;
        string institution;
        string field;
        uint256 aiScore;
        uint256 verifiedDate;
        address verifier;
        bool isActive;
    }

    // Mapping from token ID to verification data
    mapping(uint256 => VerificationData) public verifications;
    
    // Mapping from student address to token ID (one NFT per student)
    mapping(address => uint256) public studentToToken;

    // Events
    event IdentityVerified(
        address indexed student,
        uint256 indexed tokenId,
        string institution,
        uint256 aiScore,
        address verifier
    );
    
    event VerificationRevoked(
        address indexed student,
        uint256 indexed tokenId,
        address revoker
    );

    constructor() ERC721("FundMeUp Verified Student", "FMUV") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Mint soulbound NFT for verified student
     * @param student Address of verified student
     * @param institution Name of educational institution
     * @param field Field of study
     * @param aiScore AI verification score (0-100)
     */
    function mintVerificationNFT(
        address student,
        string memory institution,
        string memory field,
        uint256 aiScore
    ) external onlyRole(VERIFIER_ROLE) returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(studentToToken[student] == 0, "Student already verified");
        require(aiScore <= 100, "Invalid AI score");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(student, newTokenId);

        verifications[newTokenId] = VerificationData({
            student: student,
            institution: institution,
            field: field,
            aiScore: aiScore,
            verifiedDate: block.timestamp,
            verifier: msg.sender,
            isActive: true
        });

        studentToToken[student] = newTokenId;

        emit IdentityVerified(student, newTokenId, institution, aiScore, msg.sender);

        return newTokenId;
    }

    /**
     * @dev Get verification data for a student
     * @param student Student address
     */
    function getVerificationData(address student) 
        external 
        view 
        returns (VerificationData memory) 
    {
        uint256 tokenId = studentToToken[student];
        require(tokenId != 0, "Student not verified");
        return verifications[tokenId];
    }

    /**
     * @dev Check if student is verified
     * @param student Student address
     */
    function isVerified(address student) external view returns (bool) {
        uint256 tokenId = studentToToken[student];
        if (tokenId == 0) return false;
        return verifications[tokenId].isActive;
    }

    /**
     * @dev Revoke verification (in case of fraud)
     * @param student Student address
     */
    function revokeVerification(address student) 
        external 
        onlyRole(VERIFIER_ROLE) 
    {
        uint256 tokenId = studentToToken[student];
        require(tokenId != 0, "Student not verified");

        verifications[tokenId].isActive = false;

        emit VerificationRevoked(student, tokenId, msg.sender);
    }

    /**
     * @dev Override transfer to make NFT soulbound (non-transferable)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: Token cannot be transferred"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Grant verifier role to institution/admin
     */
    function addVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, verifier);
    }

    /**
     * @dev Remove verifier role
     */
    function removeVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, verifier);
    }

    /**
     * @dev Get total verified students
     */
    function getTotalVerified() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Required override for AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

