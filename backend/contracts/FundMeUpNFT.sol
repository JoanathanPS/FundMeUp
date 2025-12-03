// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title FundMeUpNFT
 * @notice ERC-721 NFT for donation receipts and impact tracking
 * @dev Automatically mints NFTs after successful donations
 */
contract FundMeUpNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Fee structure
    uint256 public constant PLATFORM_FEE_PERCENT = 5; // 5% to platform
    uint256 public constant RESERVE_POOL_PERCENT = 2; // 2% to reserve pool
    address public platformWallet;
    address public reservePool;
    
    // NFT Metadata
    struct DonationMetadata {
        address donor;
        address student;
        string studentName;
        uint256 amount;
        uint256 milestoneId;
        string milestoneTitle;
        uint256 timestamp;
        string message;
        uint256 progressPercent;
    }
    
    mapping(uint256 => DonationMetadata) public donationMetadata;
    mapping(address => uint256[]) public donorTokens; // Donor -> token IDs
    mapping(address => uint256[]) public studentTokens; // Student -> token IDs
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed donor,
        address indexed student,
        uint256 amount,
        string tokenURI
    );
    
    event FundsDistributed(
        uint256 totalAmount,
        uint256 platformFee,
        uint256 reservePool,
        uint256 studentAmount
    );
    
    constructor(
        address _platformWallet,
        address _reservePool
    ) ERC721("FundMeUp Donation NFT", "FMU") Ownable(msg.sender) {
        platformWallet = _platformWallet;
        reservePool = _reservePool;
    }
    
    /**
     * @notice Mint NFT after successful donation
     * @param donor Address of the donor
     * @param student Address of the student
     * @param metadata Donation metadata struct
     * @param tokenURI IPFS/metadata URI
     */
    function mintDonationNFT(
        address donor,
        address student,
        DonationMetadata memory metadata,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(donor, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        donationMetadata[tokenId] = metadata;
        donorTokens[donor].push(tokenId);
        studentTokens[student].push(tokenId);
        
        emit NFTMinted(tokenId, donor, student, metadata.amount, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @notice Distribute donation funds according to fee structure
     * @param studentAddress Address to receive the main donation
     * @param amount Total donation amount
     */
    function distributeFunds(
        address studentAddress,
        uint256 amount
    ) external payable onlyOwner {
        require(msg.value >= amount, "Insufficient funds");
        
        uint256 platformFee = (amount * PLATFORM_FEE_PERCENT) / 100;
        uint256 reserveAmount = (amount * RESERVE_POOL_PERCENT) / 100;
        uint256 studentAmount = amount - platformFee - reserveAmount;
        
        // Transfer funds
        (bool platformSuccess, ) = platformWallet.call{value: platformFee}("");
        (bool reserveSuccess, ) = reservePool.call{value: reserveAmount}("");
        (bool studentSuccess, ) = studentAddress.call{value: studentAmount}("");
        
        require(platformSuccess && reserveSuccess && studentSuccess, "Transfer failed");
        
        emit FundsDistributed(amount, platformFee, reserveAmount, studentAmount);
    }
    
    /**
     * @notice Get all NFTs owned by a donor
     * @param donor Address of the donor
     * @return tokenIds Array of token IDs
     */
    function getDonorNFTs(address donor) external view returns (uint256[] memory) {
        return donorTokens[donor];
    }
    
    /**
     * @notice Get all NFTs for a student
     * @param student Address of the student
     * @return tokenIds Array of token IDs
     */
    function getStudentNFTs(address student) external view returns (uint256[] memory) {
        return studentTokens[student];
    }
    
    /**
     * @notice Get donation metadata for a token
     * @param tokenId Token ID
     * @return metadata DonationMetadata struct
     */
    function getDonationMetadata(uint256 tokenId) external view returns (DonationMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return donationMetadata[tokenId];
    }
    
    /**
     * @notice Update platform wallet (only owner)
     */
    function setPlatformWallet(address _platformWallet) external onlyOwner {
        platformWallet = _platformWallet;
    }
    
    /**
     * @notice Update reserve pool address (only owner)
     */
    function setReservePool(address _reservePool) external onlyOwner {
        reservePool = _reservePool;
    }
}

