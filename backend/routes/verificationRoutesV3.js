const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const twilioService = require('../services/twilioService');
// const RegionalDataService = require('../services/regionalDataService'); // Commented out - not used

// Mock verification storage (in production, use database)
const verificationAttempts = new Map();

// Validation middleware for email verification request
const validateEmailVerification = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('studentName').isString().notEmpty().withMessage('Student name is required'),
  body('institution').isString().notEmpty().withMessage('Institution name is required'),
  handleValidationErrors
];

// Validation middleware for OTP verification
const validateOTPVerification = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isString().isLength({ min: 4, max: 8 }).withMessage('Valid OTP code is required'),
  handleValidationErrors
];

/**
 * @route   POST /api/verification/v3/request-email
 * @desc    Request email verification for student
 * @access  Public
 */
router.post('/request-email', validateEmailVerification, async (req, res) => {
  try {
    const { email, studentName, institution, wallet } = req.body;

    // Check if email is from a valid educational domain
    const educationalDomains = [
      'edu', 'ac.in', 'iit.ac.in', 'nit.ac.in', 'iisc.ac.in',
      'iim.ac.in', 'iiser.ac.in', 'tifr.res.in', 'tiss.edu',
      'du.ac.in', 'jnu.ac.in', 'amrita.edu', 'manipal.edu'
    ];

    const emailDomain = email.split('@')[1]?.toLowerCase();
    const isEducationalEmail = educationalDomains.some(domain => 
      emailDomain?.endsWith(domain)
    );

    if (!isEducationalEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please use your official college/university email address',
        validDomains: educationalDomains.slice(0, 5) // Show first 5 as examples
      });
    }

    // Send OTP via Twilio
    const result = await twilioService.sendEmailVerification(email, studentName);

    if (result.success) {
      // Store verification attempt
      const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      verificationAttempts.set(verificationId, {
        email,
        studentName,
        institution,
        wallet,
        status: 'pending',
        createdAt: new Date(),
        twilioSid: result.sid,
        mockCode: result.mockCode // For demo purposes
      });

      res.status(200).json({
        success: true,
        message: result.message,
        verificationId,
        email,
        mockCode: result.mockCode, // Include for demo
        nextStep: 'Check your email and enter the verification code'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in /request-email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/verification/v3/verify-email
 * @desc    Verify email OTP code
 * @access  Public
 */
router.post('/verify-email', validateOTPVerification, async (req, res) => {
  try {
    const { email, code, verificationId } = req.body;

    // Find verification attempt
    const verification = verificationAttempts.get(verificationId);
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Verification attempt not found or expired'
      });
    }

    if (verification.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Email does not match verification attempt'
      });
    }

    // Verify OTP with Twilio
    const result = await twilioService.verifyEmailCode(email, code);

    if (result.success) {
      // Update verification status
      verification.status = 'email_verified';
      verification.verifiedAt = new Date();
      verificationAttempts.set(verificationId, verification);

      // Check if all verification steps are complete
      const allStepsComplete = await checkAllVerificationSteps(verification);

      res.status(200).json({
        success: true,
        message: result.message,
        verificationId,
        email,
        status: verification.status,
        allStepsComplete,
        nextStep: allStepsComplete 
          ? 'All verification steps complete! You are now fully verified.'
          : 'Email verified. Complete AI and regional verification to become fully verified.'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        attemptsRemaining: 3 // Mock remaining attempts
      });
    }
  } catch (error) {
    console.error('Error in /verify-email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email code',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/verification/v3/status/:verificationId
 * @desc    Get verification status
 * @access  Public
 */
router.get('/status/:verificationId', async (req, res) => {
  try {
    const { verificationId } = req.params;
    const verification = verificationAttempts.get(verificationId);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    // Check all verification steps
    const allStepsComplete = await checkAllVerificationSteps(verification);

    res.status(200).json({
      success: true,
      data: {
        verificationId,
        email: verification.email,
        studentName: verification.studentName,
        institution: verification.institution,
        status: verification.status,
        allStepsComplete,
        steps: {
          emailVerification: verification.status === 'email_verified',
          aiVerification: false, // Would be set by AI verification process
          regionalVerification: false, // Would be set by regional verification process
        },
        createdAt: verification.createdAt,
        verifiedAt: verification.verifiedAt
      }
    });
  } catch (error) {
    console.error('Error in /status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/verification/v3/complete
 * @desc    Complete full verification process
 * @access  Public
 */
router.post('/complete', async (req, res) => {
  try {
    const { verificationId, aiScore, regionalVerified } = req.body;

    const verification = verificationAttempts.get(verificationId);
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Verification not found'
      });
    }

    // Update verification with AI and regional results
    verification.aiScore = aiScore;
    verification.regionalVerified = regionalVerified;
    verification.status = 'fully_verified';
    verification.completedAt = new Date();

    // Generate Soulbound NFT ID (mock)
    const soulboundNFT = `0x${Math.random().toString(16).substr(2, 40)}`;

    verificationAttempts.set(verificationId, verification);

    res.status(200).json({
      success: true,
      message: 'Student fully verified! Soulbound NFT minted.',
      data: {
        verificationId,
        status: 'fully_verified',
        soulboundNFT,
        allSteps: {
          emailVerification: true,
          aiVerification: true,
          regionalVerification: true
        },
        completedAt: verification.completedAt
      }
    });
  } catch (error) {
    console.error('Error in /complete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete verification',
      error: error.message
    });
  }
});

/**
 * Helper function to check if all verification steps are complete
 */
async function checkAllVerificationSteps(verification) {
  // In a real implementation, this would check:
  // 1. Email verification (done)
  // 2. AI verification (would be set by AI process)
  // 3. Regional verification (would be set by regional process)
  
  // For demo, we'll simulate that AI and regional are complete
  // if email is verified and enough time has passed
  const timeSinceCreated = Date.now() - verification.createdAt.getTime();
  const aiAndRegionalComplete = timeSinceCreated > 30000; // 30 seconds for demo

  return verification.status === 'email_verified' && aiAndRegionalComplete;
}

module.exports = router;
