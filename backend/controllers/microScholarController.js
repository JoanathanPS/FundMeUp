const Proof = require('../models/Proof');
const Scholarship = require('../models/Scholarship');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const Encouragement = require('../models/Encouragement');
const pinataService = require('../utils/pinata');
const ocrRiskAnalyzer = require('../ai/ocrRisk');
const { ethers } = require('ethers');
const fs = require('fs');

// Import contract service (will be created by deployment script)
let contractService;
try {
  contractService = require('../services/contract');
} catch (error) {
  console.warn('Contract service not available. Deploy contract first.');
  contractService = { contractABI: [], contractAddress: '' };
}

/**
 * Submit proof with IPFS upload and smart contract interaction
 * POST /submit-proof
 */
const submitProof = async (req, res) => {
  try {
    const { scholarshipId, studentWallet, proofType, description } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Verify student exists
    const student = await Student.findOne({ walletAddress: studentWallet.toLowerCase() });
    if (!student) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify scholarship exists
    const scholarship = await Scholarship.findOne({ scholarshipId });
    if (!scholarship) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Perform AI fraud risk analysis
    console.log('Running AI fraud detection...');
    const riskAnalysis = await ocrRiskAnalyzer.analyzeProof(req.file.path, {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Upload file to IPFS via Pinata
    const ipfsResult = await pinataService.uploadFile(req.file.path, {
      name: `proof-${scholarshipId}-${studentWallet}-${Date.now()}`
    });

    // Create proof record with risk analysis
    const proof = new Proof({
      scholarshipId,
      studentWallet: studentWallet.toLowerCase(),
      proofType,
      ipfsHash: ipfsResult.ipfsHash,
      description,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      verificationStatus: riskAnalysis.needsManualReview ? 'pending' : 'pending'
    });

    // Interact with smart contract
    let txHash = null;
    if (contractService.contractAddress && process.env.RPC_URL) {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
          contractService.contractAddress,
          contractService.contractABI,
          signer
        );

        // Submit proof to smart contract
        const tx = await contract.submitProof(scholarshipId, ipfsResult.ipfsHash);
        const receipt = await tx.wait();
        txHash = receipt.hash;
        proof.blockchainTxHash = txHash;

        // Record transaction
        const transaction = new Transaction({
          txHash: txHash,
          type: 'proof_verified',
          from: studentWallet.toLowerCase(),
          scholarshipId: scholarshipId,
          studentWallet: studentWallet.toLowerCase(),
          status: 'confirmed',
          ipfsHash: ipfsResult.ipfsHash
        });
        await transaction.save();
      } catch (contractError) {
        console.error('Smart contract interaction failed:', contractError.message);
        // Continue without contract interaction
      }
    }

    await proof.save();

    // Clean up uploaded file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Proof submitted successfully',
      data: {
        proof,
        ipfsUrl: ipfsResult.url,
        riskAnalysis: {
          level: riskAnalysis.riskLevel,
          score: riskAnalysis.riskScore,
          needsReview: riskAnalysis.needsManualReview,
          recommendation: riskAnalysis.recommendation
        },
        txHash
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error submitting proof:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting proof',
      error: error.message
    });
  }
};

/**
 * Get leaderboard of top donors
 * POST /leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.body;

    // Get top donors from blockchain events
    let leaderboard = [];

    if (contractService.contractAddress && process.env.RPC_URL) {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const contract = new ethers.Contract(
          contractService.contractAddress,
          contractService.contractABI,
          provider
        );

        // Get unique donors from transactions
        const transactions = await Transaction.find({
          type: { $in: ['scholarship_created', 'scholarship_funded'] }
        }).sort({ amount: -1 });

        // Aggregate donations by address
        const donorMap = new Map();
        
        for (const tx of transactions) {
          const address = tx.from.toLowerCase();
          const amount = parseFloat(tx.amount || 0);
          
          if (donorMap.has(address)) {
            donorMap.get(address).totalDonated += amount;
            donorMap.get(address).scholarshipCount += 1;
          } else {
            // Try to get total from contract
            let contractTotal = 0;
            try {
              contractTotal = await contract.getDonorTotal(address);
              contractTotal = parseFloat(ethers.formatEther(contractTotal));
            } catch (e) {
              contractTotal = amount;
            }

            donorMap.set(address, {
              address,
              totalDonated: Math.max(amount, contractTotal),
              scholarshipCount: 1,
              lastDonation: tx.createdAt
            });
          }
        }

        // Convert to array and sort
        leaderboard = Array.from(donorMap.values())
          .sort((a, b) => b.totalDonated - a.totalDonated)
          .slice(0, limit)
          .map((donor, index) => ({
            rank: index + 1,
            ...donor
          }));

      } catch (contractError) {
        console.error('Error fetching from contract:', contractError.message);
      }
    }

    // Fallback to database aggregation
    if (leaderboard.length === 0) {
      const dbLeaderboard = await Transaction.aggregate([
        {
          $match: {
            type: { $in: ['scholarship_created', 'scholarship_funded'] },
            status: 'confirmed'
          }
        },
        {
          $group: {
            _id: '$from',
            totalDonated: { $sum: { $toDouble: '$amount' } },
            scholarshipCount: { $sum: 1 },
            lastDonation: { $max: '$createdAt' }
          }
        },
        {
          $sort: { totalDonated: -1 }
        },
        {
          $limit: limit
        }
      ]);

      leaderboard = dbLeaderboard.map((donor, index) => ({
        rank: index + 1,
        address: donor._id,
        totalDonated: donor.totalDonated,
        scholarshipCount: donor.scholarshipCount,
        lastDonation: donor.lastDonation
      }));
    }

    res.status(200).json({
      success: true,
      data: leaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

/**
 * Get live feed of blockchain events + database activities
 * Includes: proof submissions, NFT badges, encouragements, media content
 * GET /feed
 */
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    // Get recent transactions from database
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get recent scholarships
    const scholarships = await Scholarship.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('scholarshipId name provider providerName amount createdAt');

    // Get recent proofs with media content
    const proofs = await Proof.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('scholarshipId studentWallet verificationStatus ipfsHash createdAt fileName');

    // Get recent encouragements
    const encouragements = await Encouragement.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('donorAddress donorName message scholarshipId studentWallet createdAt');

    // Get recent students with milestones containing media
    const Student = require('../models/Student');
    const studentsWithMedia = await Student.find({
      'milestones.mediaCID': { $exists: true, $ne: null }
    })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('walletAddress name milestones badges updatedAt');

    // Build comprehensive feed
    const feed = [];

    // Add transactions
    transactions.forEach(tx => {
      feed.push({
        id: tx._id,
        type: 'transaction',
        action: tx.type,
        data: {
          txHash: tx.txHash,
          from: tx.from,
          to: tx.to,
          amount: tx.amount,
          scholarshipId: tx.scholarshipId,
          ipfsHash: tx.ipfsHash
        },
        timestamp: tx.createdAt
      });
    });

    // Add scholarships
    scholarships.forEach(sch => {
      feed.push({
        id: sch._id,
        type: 'scholarship',
        action: 'scholarship_created',
        data: {
          scholarshipId: sch.scholarshipId,
          name: sch.name,
          provider: sch.provider,
          providerName: sch.providerName,
          amount: sch.amount
        },
        timestamp: sch.createdAt
      });
    });

    // Add proof submissions with media
    proofs.forEach(proof => {
      feed.push({
        id: proof._id,
        type: 'proof',
        action: proof.verificationStatus === 'verified' ? 'proof_verified' : 'proof_submitted',
        data: {
          scholarshipId: proof.scholarshipId,
          student: proof.studentWallet,
          status: proof.verificationStatus,
          mediaIPFS: proof.ipfsHash,
          fileName: proof.fileName,
          mediaUrl: proof.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${proof.ipfsHash}` : null
        },
        timestamp: proof.createdAt
      });
    });

    // Add encouragement messages
    encouragements.forEach(enc => {
      feed.push({
        id: enc._id,
        type: 'encouragement',
        action: 'message_sent',
        data: {
          from: enc.donorName || enc.donorAddress,
          to: enc.studentWallet,
          message: enc.message,
          scholarshipId: enc.scholarshipId,
          donor: enc.donorAddress
        },
        timestamp: enc.createdAt
      });
    });

    // Add NFT badge issuance events from student badges
    studentsWithMedia.forEach(student => {
      if (student.badges && student.badges.length > 0) {
        student.badges.forEach(badge => {
          feed.push({
            id: `badge-${badge.tokenId}`,
            type: 'nft_badge',
            action: 'badge_minted',
            data: {
              tokenId: badge.tokenId,
              student: student.walletAddress,
              studentName: student.name,
              scholarshipId: badge.scholarshipId,
              achievement: badge.achievement
            },
            timestamp: badge.mintedAt || student.updatedAt
          });
        });
      }

      // Add milestone completions with media
      if (student.milestones && student.milestones.length > 0) {
        student.milestones
          .filter(m => m.mediaCID && m.status === 'completed')
          .forEach(milestone => {
            feed.push({
              id: `milestone-${student._id}-${milestone._id}`,
              type: 'milestone',
              action: 'milestone_completed',
              data: {
                student: student.walletAddress,
                studentName: student.name,
                title: milestone.title,
                amount: milestone.amount,
                mediaCID: milestone.mediaCID,
                mediaUrl: `https://gateway.pinata.cloud/ipfs/${milestone.mediaCID}`
              },
              timestamp: milestone.verifiedAt || student.updatedAt
            });
          });
      }
    });

    // Filter by type if specified
    let filteredFeed = feed;
    if (type) {
      filteredFeed = feed.filter(item => item.type === type);
    }

    // Sort by timestamp and paginate
    const sortedFeed = filteredFeed
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: sortedFeed,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: sortedFeed.length
      },
      filterOptions: {
        availableTypes: ['transaction', 'scholarship', 'proof', 'encouragement', 'nft_badge', 'milestone']
      }
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message
    });
  }
};

/**
 * Store donor encouragement message with signature
 * POST /encourage
 */
const encourage = async (req, res) => {
  try {
    const { 
      donorAddress, 
      donorName, 
      studentWallet, 
      scholarshipId, 
      message, 
      signature,
      amount,
      isPublic = true 
    } = req.body;

    // Verify signature (simple verification)
    try {
      const messageHash = ethers.hashMessage(message);
      const recoveredAddress = ethers.recoverAddress(messageHash, signature);
      
      if (recoveredAddress.toLowerCase() !== donorAddress.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature'
        });
      }
    } catch (signatureError) {
      console.error('Signature verification error:', signatureError);
      return res.status(400).json({
        success: false,
        message: 'Signature verification failed'
      });
    }

    // Create encouragement record
    const encouragement = new Encouragement({
      donorAddress: donorAddress.toLowerCase(),
      donorName,
      studentWallet: studentWallet.toLowerCase(),
      scholarshipId,
      message,
      signature,
      amount,
      isPublic,
      verified: true
    });

    await encouragement.save();

    // Update student if exists
    if (studentWallet) {
      const student = await Student.findOne({ 
        walletAddress: studentWallet.toLowerCase() 
      });
      
      if (student) {
        // Could add encouragement count or other stats here
        console.log(`Encouragement sent to student: ${student.name}`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Encouragement message saved successfully',
      data: encouragement
    });
  } catch (error) {
    console.error('Error saving encouragement:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving encouragement message',
      error: error.message
    });
  }
};

module.exports = {
  submitProof,
  getLeaderboard,
  getFeed,
  encourage
};



