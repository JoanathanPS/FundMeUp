const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const aiServiceV2 = require('../services/aiServiceV2');

/**
 * Enhanced Verification Routes for FundMeUp ETHIndia
 * Handles: Student verification requests, AI-powered verification, status checks
 */

/**
 * @route   POST /api/verification/request
 * @desc    Student requests verification
 * @access  Public
 */
router.post('/request', async (req, res) => {
  try {
    const { walletAddress, studentData } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const student = await Student.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Run AI eligibility check
    const profileData = {
      name: student.name,
      dream: student.dream || studentData?.dream,
      field: student.field,
      year: student.yearOfStudy || student.year,
      institution: student.institution,
      grades: student.gpa ? `GPA: ${student.gpa}` : 'Not provided',
      country: student.country,
      walletAddress
    };

    const aiVerification = await aiServiceV2.verifyEligibility(profileData);

    // Update student verification status based on AI results
    const newStatus = aiVerification.verdict === 'approve' ? 'verified' : 
                     aiVerification.verdict === 'review' ? 'pending' : 'rejected';

    student.verificationStatus = newStatus;
    student.aiVerificationScore = aiVerification.eligibilityScore;
    student.aiVerificationData = {
      reasoning: aiVerification.reasoning,
      strengths: aiVerification.strengths,
      concerns: aiVerification.concerns,
      recommendations: aiVerification.recommendations,
      assessedAt: aiVerification.assessedAt
    };

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Verification request processed',
      data: {
        verificationStatus: newStatus,
        aiAssessment: aiVerification,
        nextSteps: aiVerification.recommendations
      }
    });

  } catch (error) {
    console.error('Verification Request Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing verification request',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/verification/approve
 * @desc    Admin/Institution approves student verification
 * @access  Admin (should add auth middleware in production)
 */
router.post('/approve', async (req, res) => {
  try {
    const { walletAddress, approverWallet, institutionName, notes } = req.body;

    if (!walletAddress || !approverWallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and approver wallet are required'
      });
    }

    const student = await Student.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update verification
    student.verificationStatus = 'verified';
    student.verifiedByInstitution = true;
    student.institutionName = institutionName || student.institution;
    student.verificationApprover = approverWallet.toLowerCase();
    student.verificationNotes = notes;
    student.verifiedAt = new Date();

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student verification approved',
      data: {
        studentName: student.name,
        institution: student.institutionName,
        verifiedAt: student.verifiedAt
      }
    });

  } catch (error) {
    console.error('Verification Approval Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving verification',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/verification/status/:wallet
 * @desc    Check verification status for a student
 * @access  Public
 */
router.get('/status/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    const student = await Student.findOne({ walletAddress: wallet.toLowerCase() })
      .select('name verificationStatus verifiedByInstitution institutionName aiVerificationScore aiVerificationData verifiedAt');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        studentName: student.name,
        verificationStatus: student.verificationStatus || 'pending',
        verifiedByInstitution: student.verifiedByInstitution || false,
        institutionName: student.institutionName,
        aiScore: student.aiVerificationScore,
        aiAssessment: student.aiVerificationData,
        verifiedAt: student.verifiedAt,
        isVerified: student.verificationStatus === 'verified'
      }
    });

  } catch (error) {
    console.error('Verification Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification status',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/verification/pending
 * @desc    Get all pending verification requests
 * @access  Admin
 */
router.get('/pending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const pendingStudents = await Student.find({ 
      verificationStatus: 'pending' 
    })
    .select('name email institution field dream walletAddress aiVerificationScore createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total: pendingStudents.length,
      data: pendingStudents.map(s => ({
        walletAddress: s.walletAddress,
        name: s.name,
        email: s.email,
        institution: s.institution,
        field: s.field,
        dream: s.dream?.substring(0, 100) + '...',
        aiScore: s.aiVerificationScore,
        requestedAt: s.createdAt
      }))
    });

  } catch (error) {
    console.error('Pending Verifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending verifications',
      error: error.message
    });
  }
});

module.exports = router;

