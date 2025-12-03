// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ImpactToken
 * @dev ERC20 token rewarded to donors for their contributions
 */
contract ImpactToken is ERC20, Ownable {
    constructor() ERC20("FundMeUp Impact Token", "FMUI") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

/**
 * @title FundMeUpV3
 * @dev Enhanced scholarship platform with Impact Tokens and donor tracking
 * @notice ETHIndia Hackathon Version - Production Ready
 */
contract FundMeUpV3 is Ownable, ReentrancyGuard {
    
    ImpactToken public impactToken;
    
    uint256 public scholarshipCounter;
    uint256 public constant IMPACT_TOKENS_PER_ETH = 1000; // 1000 FMUI per 1 ETH
    
    struct Scholarship {
        address student;
        uint256 goalAmount;
        uint256 raisedAmount;
        uint256 fundsReleased;
        uint256 savingsAmount; // 10% auto-savings
        uint256 milestoneCount;
        uint256 verifiedMilestones;
        bool completed;
        bool exists;
        uint256 createdAt;
    }

    struct Milestone {
        string cid; // IPFS CID for proof
        bool verified;
        uint256 riskScore; // AI risk score (0-100)
        uint256 verifiedAt;
    }

    struct Donor {
        uint256 totalDonated;
        uint256 studentsSupported;
        uint256 impactScore;
        uint256 lastDonationTime;
    }

    // Mappings
    mapping(uint256 => Scholarship) public scholarships;
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
    mapping(uint256 => address[]) public fundingCircle; // Donors for each scholarship
    mapping(uint256 => mapping(address => uint256)) public donorContributions;
    mapping(address => uint256[]) public studentScholarships;
    mapping(address => Donor) public donors;

    // Events
    event ScholarshipCreated(
        uint256 indexed id,
        address indexed student,
        uint256 goalAmount,
        uint256 milestoneCount
    );

    event Funded(
        uint256 indexed id,
        address indexed donor,
        uint256 amount,
        uint256 impactTokensMinted
    );

    event MilestoneSubmitted(
        uint256 indexed scholarshipId,
        uint256 indexed milestoneIndex,
        string cid
    );

    event MilestoneVerified(
        uint256 indexed scholarshipId,
        uint256 indexed milestoneIndex,
        uint256 riskScore
    );

    event FundsReleased(
        uint256 indexed scholarshipId,
        address indexed student,
        uint256 amount,
        uint256 savingsAmount
    );

    event ImpactTokensAwarded(
        address indexed donor,
        uint256 amount
    );

    constructor() {
        impactToken = new ImpactToken();
    }

    /**
     * @dev Create a new scholarship for a student
     */
    function createScholarship(
        address student,
        uint256 goalAmount,
        uint256 milestoneCount
    ) external returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(goalAmount > 0, "Goal amount must be positive");
        require(milestoneCount > 0, "At least one milestone required");

        scholarshipCounter++;
        uint256 scholarshipId = scholarshipCounter;

        scholarships[scholarshipId] = Scholarship({
            student: student,
            goalAmount: goalAmount,
            raisedAmount: 0,
            fundsReleased: 0,
            savingsAmount: 0,
            milestoneCount: milestoneCount,
            verifiedMilestones: 0,
            completed: false,
            exists: true,
            createdAt: block.timestamp
        });

        studentScholarships[student].push(scholarshipId);

        emit ScholarshipCreated(scholarshipId, student, goalAmount, milestoneCount);

        return scholarshipId;
    }

    /**
     * @dev Fund a scholarship and earn Impact Tokens
     */
    function fundScholarship(uint256 scholarshipId) 
        external 
        payable 
        nonReentrant 
    {
        require(scholarships[scholarshipId].exists, "Scholarship does not exist");
        require(!scholarships[scholarshipId].completed, "Scholarship completed");
        require(msg.value > 0, "Donation must be positive");

        Scholarship storage scholarship = scholarships[scholarshipId];

        // Update scholarship
        scholarship.raisedAmount += msg.value;

        // Update donor
        Donor storage donor = donors[msg.sender];
        if (donor.totalDonated == 0) {
            // First time donor
            fundingCircle[scholarshipId].push(msg.sender);
        }
        donor.totalDonated += msg.value;
        donor.studentsSupported = getUnique StudentsSupported(msg.sender);
        donor.impactScore += msg.value / 1 ether; // Simple score calculation
        donor.lastDonationTime = block.timestamp;

        // Track contribution
        donorContributions[scholarshipId][msg.sender] += msg.value;

        // Mint Impact Tokens for donor
        uint256 impactTokensToMint = (msg.value * IMPACT_TOKENS_PER_ETH) / 1 ether;
        if (impactTokensToMint > 0) {
            impactToken.mint(msg.sender, impactTokensToMint);
            emit ImpactTokensAwarded(msg.sender, impactTokensToMint);
        }

        emit Funded(scholarshipId, msg.sender, msg.value, impactTokensToMint);
    }

    /**
     * @dev Submit proof for a milestone
     */
    function submitProof(
        uint256 scholarshipId,
        uint256 milestoneIndex,
        string memory cid
    ) external {
        require(scholarships[scholarshipId].exists, "Scholarship does not exist");
        require(
            msg.sender == scholarships[scholarshipId].student,
            "Only student can submit proof"
        );
        require(milestoneIndex < scholarships[scholarshipId].milestoneCount, "Invalid milestone");
        require(bytes(milestones[scholarshipId][milestoneIndex].cid).length == 0, "Proof already submitted");

        milestones[scholarshipId][milestoneIndex].cid = cid;

        emit MilestoneSubmitted(scholarshipId, milestoneIndex, cid);
    }

    /**
     * @dev Verify milestone with AI risk score
     */
    function verifyMilestone(
        uint256 scholarshipId,
        uint256 milestoneIndex,
        uint256 riskScore
    ) external onlyOwner {
        require(scholarships[scholarshipId].exists, "Scholarship does not exist");
        require(bytes(milestones[scholarshipId][milestoneIndex].cid).length > 0, "No proof submitted");
        require(!milestones[scholarshipId][milestoneIndex].verified, "Already verified");
        require(riskScore <= 100, "Invalid risk score");

        milestones[scholarshipId][milestoneIndex].verified = true;
        milestones[scholarshipId][milestoneIndex].riskScore = riskScore;
        milestones[scholarshipId][milestoneIndex].verifiedAt = block.timestamp;

        scholarships[scholarshipId].verifiedMilestones++;

        emit MilestoneVerified(scholarshipId, milestoneIndex, riskScore);
    }

    /**
     * @dev Release funds after milestone verification
     * 90% to student, 10% to savings
     */
    function releaseFunds(uint256 scholarshipId) 
        external 
        nonReentrant 
    {
        Scholarship storage scholarship = scholarships[scholarshipId];
        
        require(scholarship.exists, "Scholarship does not exist");
        require(!scholarship.completed, "Scholarship completed");
        require(
            msg.sender == scholarship.student || msg.sender == owner(),
            "Unauthorized"
        );

        uint256 verifiedMilestones = scholarship.verifiedMilestones;
        require(verifiedMilestones > 0, "No verified milestones");

        // Calculate funds to release
        uint256 totalEligible = (scholarship.raisedAmount * verifiedMilestones) / scholarship.milestoneCount;
        uint256 toRelease = totalEligible - scholarship.fundsReleased - scholarship.savingsAmount;

        require(toRelease > 0, "No funds to release");

        // Calculate student amount (90%) and savings (10%)
        uint256 studentAmount = (toRelease * 90) / 100;
        uint256 savingsAmount = toRelease - studentAmount;

        scholarship.fundsReleased += studentAmount;
        scholarship.savingsAmount += savingsAmount;

        // Transfer to student
        (bool success, ) = scholarship.student.call{value: studentAmount}("");
        require(success, "Transfer failed");

        // Check if completed
        if (verifiedMilestones == scholarship.milestoneCount) {
            scholarship.completed = true;
        }

        emit FundsReleased(scholarshipId, scholarship.student, studentAmount, savingsAmount);
    }

    /**
     * @dev Withdraw savings (student can withdraw after completion)
     */
    function withdrawSavings(uint256 scholarshipId) external nonReentrant {
        Scholarship storage scholarship = scholarships[scholarshipId];
        
        require(scholarship.exists, "Scholarship does not exist");
        require(msg.sender == scholarship.student, "Only student can withdraw");
        require(scholarship.completed, "Scholarship not completed");
        require(scholarship.savingsAmount > 0, "No savings available");

        uint256 amount = scholarship.savingsAmount;
        scholarship.savingsAmount = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Get scholarship details
     */
    function getScholarship(uint256 scholarshipId) 
        external 
        view 
        returns (Scholarship memory) 
    {
        require(scholarships[scholarshipId].exists, "Scholarship does not exist");
        return scholarships[scholarshipId];
    }

    /**
     * @dev Get milestone details
     */
    function getMilestone(uint256 scholarshipId, uint256 milestoneIndex)
        external
        view
        returns (Milestone memory)
    {
        return milestones[scholarshipId][milestoneIndex];
    }

    /**
     * @dev Get funding circle for scholarship
     */
    function getFundingCircle(uint256 scholarshipId)
        external
        view
        returns (address[] memory)
    {
        return fundingCircle[scholarshipId];
    }

    /**
     * @dev Get donor info
     */
    function getDonorInfo(address donorAddress)
        external
        view
        returns (Donor memory)
    {
        return donors[donorAddress];
    }

    /**
     * @dev Get student's scholarships
     */
    function getStudentScholarships(address student)
        external
        view
        returns (uint256[] memory)
    {
        return studentScholarships[student];
    }

    /**
     * @dev Get unique students supported by donor
     */
    function getUniqueStudentsSupported(address donor) 
        internal 
        view 
        returns (uint256) 
    {
        uint256 count = 0;
        address[] memory students = new address[](scholarshipCounter);
        
        for (uint256 i = 1; i <= scholarshipCounter; i++) {
            if (donorContributions[i][donor] > 0) {
                address student = scholarships[i].student;
                bool isNew = true;
                for (uint256 j = 0; j < count; j++) {
                    if (students[j] == student) {
                        isNew = false;
                        break;
                    }
                }
                if (isNew) {
                    students[count] = student;
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * @dev Get Impact Token address
     */
    function getImpactTokenAddress() external view returns (address) {
        return address(impactToken);
    }
}

