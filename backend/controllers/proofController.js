const Proof = require('../models/Proof');
const Scholarship = require('../models/Scholarship');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const pinataService = require('../utils/pinata');
const ethersService = require('../utils/ethers');
const fs = require('fs');

/**
 * Upload proof document
 * POST /upload-proof
 */
const uploadProof = async (req, res) => {
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
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify scholarship exists
    const scholarship = await Scholarship.findOne({ scholarshipId });
    if (!scholarship) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Upload file to IPFS via Pinata
    const ipfsResult = await pinataService.uploadFile(req.file.path, {
      name: `proof-${scholarshipId}-${studentWallet}-${Date.now()}`
    });

    // Create proof record
    const proof = new Proof({
      scholarshipId,
      studentWallet: studentWallet.toLowerCase(),
      proofType,
      ipfsHash: ipfsResult.ipfsHash,
      description,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      verificationStatus: 'pending'
    });

    await proof.save();

    // Clean up uploaded file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Proof uploaded successfully',
      data: {
        proof,
        ipfsUrl: ipfsResult.url
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error uploading proof:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading proof',
      error: error.message
    });
  }
};

/**
 * Verify proof document
 * POST /verify-proof
 */
const verifyProof = async (req, res) => {
  try {
    const { proofId, verifierAddress, status, notes } = req.body;

    // Find proof
    const proof = await Proof.findById(proofId);

    if (!proof) {
      return res.status(404).json({
        success: false,
        message: 'Proof not found'
      });
    }

    if (proof.verificationStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Proof has already been verified'
      });
    }

    // Update proof verification status
    proof.verificationStatus = status;
    proof.verifiedBy = verifierAddress.toLowerCase();
    proof.verifiedAt = new Date();
    proof.verificationNotes = notes;

    // If verified, interact with smart contract
    if (status === 'verified') {
      // TODO: Call smart contract to verify proof
      // const txResult = await ethersService.verifyProof(
      //   proof.scholarshipId,
      //   proof.studentWallet,
      //   proof.ipfsHash
      // );

      // Create transaction record
      const transaction = new Transaction({
        txHash: '0x' + Date.now().toString(16) + Math.random().toString(16).substr(2), // Placeholder
        type: 'proof_verified',
        from: verifierAddress.toLowerCase(),
        to: proof.studentWallet,
        scholarshipId: proof.scholarshipId,
        studentWallet: proof.studentWallet,
        status: 'confirmed',
        ipfsHash: proof.ipfsHash,
        metadata: {
          proofType: proof.proofType,
          verificationNotes: notes
        }
      });

      await transaction.save();
      proof.blockchainTxHash = transaction.txHash;

      // Update scholarship and student records
      const scholarship = await Scholarship.findOne({ scholarshipId: proof.scholarshipId });
      const student = await Student.findOne({ walletAddress: proof.studentWallet });

      if (scholarship && student) {
        // Add to recipients if not already added
        const existingRecipient = scholarship.recipients.find(
          r => r.studentWallet === proof.studentWallet
        );

        if (!existingRecipient) {
          scholarship.recipients.push({
            studentWallet: proof.studentWallet,
            amount: scholarship.amount,
            disbursedAt: new Date(),
            proofIPFS: proof.ipfsHash
          });
          scholarship.currentRecipients += 1;
          await scholarship.save();

          // Update student's received scholarships
          student.receivedScholarships.push({
            scholarshipId: scholarship._id,
            amount: parseFloat(scholarship.amountInEth),
            receivedAt: new Date()
          });
          await student.save();
        }
      }
    }

    await proof.save();

    res.status(200).json({
      success: true,
      message: 'Proof verification updated successfully',
      data: proof
    });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying proof',
      error: error.message
    });
  }
};

/**
 * Get all proofs
 * GET /proofs
 */
const getAllProofs = async (req, res) => {
  try {
    const { page = 1, limit = 10, scholarshipId, studentWallet, status } = req.query;

    const query = {};
    if (scholarshipId) {
      query.scholarshipId = scholarshipId;
    }
    if (studentWallet) {
      query.studentWallet = studentWallet.toLowerCase();
    }
    if (status) {
      query.verificationStatus = status;
    }

    const proofs = await Proof.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Proof.countDocuments(query);

    res.status(200).json({
      success: true,
      data: proofs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proofs',
      error: error.message
    });
  }
};

module.exports = {
  uploadProof,
  verifyProof,
  getAllProofs
};


