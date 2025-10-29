const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const aiServiceV2 = require('../services/aiServiceV2');

/**
 * Enhanced AI Routes for ETHIndia FundMeUp
 * Provides: Proof analysis, eligibility verification, message generation
 */

/**
 * @route   POST /api/ai/analyze-proof
 * @desc    Analyze proof document with detailed verification
 * @access  Public
 */
router.post('/analyze-proof', async (req, res) => {
  try {
    const { extractedText, metadata, fileType, studentInfo, milestoneInfo } = req.body;

    if (!extractedText && !metadata) {
      return res.status(400).json({
        success: false,
        message: 'Either extractedText or metadata is required'
      });
    }

    const proofData = {
      extractedText: extractedText || '',
      metadata: metadata || {},
      fileType: fileType || 'unknown',
      studentInfo: studentInfo || {},
      milestoneInfo: milestoneInfo || {}
    };

    const analysis = await aiServiceV2.analyzeProof(proofData);

    res.status(200).json({
      success: true,
      message: 'Proof analysis completed',
      data: analysis
    });

  } catch (error) {
    console.error('Analyze Proof Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing proof',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/verify-eligibility
 * @desc    Verify student eligibility for scholarships
 * @access  Public
 */
router.post('/verify-eligibility', async (req, res) => {
  try {
    const studentProfile = req.body;

    if (!studentProfile.name || !studentProfile.dream || !studentProfile.field) {
      return res.status(400).json({
        success: false,
        message: 'Name, dream, and field are required'
      });
    }

    const verification = await aiServiceV2.verifyEligibility(studentProfile);

    res.status(200).json({
      success: true,
      message: 'Eligibility verification completed',
      data: verification
    });

  } catch (error) {
    console.error('Verify Eligibility Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying eligibility',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/generate-encouragement
 * @desc    Generate encouraging message for student
 * @access  Public
 */
router.post('/generate-encouragement', async (req, res) => {
  try {
    const { studentName, donorName, milestoneTitle, studentField } = req.body;

    if (!studentName || !donorName) {
      return res.status(400).json({
        success: false,
        message: 'Student name and donor name are required'
      });
    }

    const context = {
      studentName,
      donorName,
      milestoneTitle: milestoneTitle || 'their academic milestone',
      studentField: studentField || 'their field of study'
    };

    const result = await aiServiceV2.generateEncouragementMessage(context);

    res.status(200).json({
      success: true,
      message: 'Encouragement message generated',
      data: result
    });

  } catch (error) {
    console.error('Generate Encouragement Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating message',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/verify-regional
 * @desc    Verify regional/institutional data
 * @access  Public
 */
router.post('/verify-regional', async (req, res) => {
  try {
    const { studentInfo, institutionInfo, location } = req.body;

    const data = {
      studentInfo: studentInfo || {},
      institutionInfo: institutionInfo || {},
      location: location || 'Unknown'
    };

    const analysis = await aiServiceV2.analyzeRegionalData(data);

    res.status(200).json({
      success: true,
      message: 'Regional verification completed',
      data: analysis
    });

  } catch (error) {
    console.error('Regional Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying regional data',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ai/health
 * @desc    Check AI service health and provider info
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Service is running',
    provider: aiServiceV2.provider,
    initialized: aiServiceV2.initialized,
    features: [
      'Proof Analysis',
      'Eligibility Verification',
      'Message Generation',
      'Regional Verification'
    ]
  });
});

module.exports = router;

