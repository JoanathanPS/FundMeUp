const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilioService');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   POST /api/email/send-otp
 * @desc    Send OTP to student's email via Twilio
 * @access  Public
 */
router.post('/send-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email } = req.body;

    // Validate educational email domain
    if (!twilioService.isValidEducationalEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid educational email domain. Please use your official college/university email address.'
      });
    }

    // Send verification code
    const result = await twilioService.sendVerificationEmail(email);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message || 'Verification code sent to your email',
        sid: result.sid,
        mockCode: result.mockCode // Only in demo mode
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to send verification code'
      });
    }
  } catch (error) {
    console.error('Error in /send-otp:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send verification code'
    });
  }
});

/**
 * @route   POST /api/email/verify-otp
 * @desc    Verify OTP code from student's email
 * @access  Public
 */
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isString().notEmpty().withMessage('Verification code is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, code } = req.body;

    // Verify the code
    const result = await twilioService.verifyEmailCode(email, code);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message || 'Email verified successfully',
        verified: true
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Invalid verification code'
      });
    }
  } catch (error) {
    console.error('Error in /verify-otp:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify code'
    });
  }
});

module.exports = router;

