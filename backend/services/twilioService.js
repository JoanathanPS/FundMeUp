const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = null;
    this.serviceSid = null;
    this.initialized = false;
    this.isDemoMode = false;
    this.validDomains = [
      'saveetha.com',
      'vitstudent.ac.in', 
      'ssn.edu.in',
      'edu.in',
      'ac.in',
      'iit.ac.in',
      'nit.ac.in',
      'iisc.ac.in',
      'iim.ac.in',
      'iiser.ac.in',
      'tifr.res.in',
      'tiss.edu',
      'du.ac.in',
      'jnu.ac.in',
      'amrita.edu',
      'manipal.edu',
      'bits-pilani.ac.in',
      'srmuniv.ac.in',
      'lpu.in',
      'kiit.ac.in',
      'vit.ac.in'
    ]; // Indian educational domains including custom ones
  }

  async initialize() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACC_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const serviceSid = process.env.TWILIO_SERVICE_SID || process.env.VERIFY_SERVICE_SID;
      
      if (accountSid && authToken && serviceSid) {
        this.client = twilio(accountSid, authToken);
        this.serviceSid = serviceSid;
        this.initialized = true;
        console.log('✅ Twilio Service initialized successfully');
      } else {
        console.warn('⚠️  Twilio credentials not configured. Email verification will use mock responses.');
        this.isDemoMode = true;
        this.initialized = false;
      }
    } catch (error) {
      console.error('⚠️  Twilio Service initialization failed:', error.message);
      this.isDemoMode = true;
      this.initialized = false;
    }
  }

  isValidEducationalEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailDomain = email.split('@')[1]?.toLowerCase();
    return this.validDomains.some(domain => emailDomain?.endsWith(domain));
  }

  /**
   * Send OTP to student's college email
   */
  async sendVerificationEmail(email, studentName = 'Student') {
    return this.sendEmailVerification(email, studentName);
  }

  async sendEmailVerification(email, studentName = 'Student') {
    try {
      // Validate email domain first
      if (!this.isValidEducationalEmail(email)) {
        return {
          success: false,
          message: 'Invalid educational email domain. Please use your official college/university email address.'
        };
      }

      if (!this.initialized || this.isDemoMode) {
        // Mock response for demo
        console.log(`📧 Mock email sent to ${email} for ${studentName}`);
        return {
          success: true,
          sid: `mock_${Date.now()}`,
          status: 'pending',
          message: 'Mock OTP sent to email (demo mode)',
          mockCode: '123456' // For demo purposes
        };
      }

      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications
        .create({
          to: email,
          channel: 'email',
          customFriendlyName: `FundMeUp Verification for ${studentName}`
        });

      return {
        success: true,
        sid: verification.sid,
        status: verification.status,
        message: 'OTP sent to your college email'
      };
    } catch (error) {
      console.error('Error sending email verification:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send verification email'
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyEmailCode(email, code) {
    try {
      if (!this.initialized) {
        // Mock verification for demo
        const isValidCode = code === '123456' || code === '000000';
        return {
          success: isValidCode,
          status: isValidCode ? 'approved' : 'denied',
          message: isValidCode ? 'Email verified successfully (demo mode)' : 'Invalid verification code',
          mock: true
        };
      }

      const verificationCheck = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks
        .create({
          to: email,
          code: code
        });

      return {
        success: verificationCheck.status === 'approved',
        status: verificationCheck.status,
        message: verificationCheck.status === 'approved' 
          ? 'Email verified successfully' 
          : 'Invalid verification code'
      };
    } catch (error) {
      console.error('Error verifying email code:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to verify email code'
      };
    }
  }

  /**
   * Check verification status
   */
  async getVerificationStatus(sid) {
    try {
      if (!this.initialized) {
        return {
          success: true,
          status: 'pending',
          message: 'Mock verification status'
        };
      }

      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications(sid)
        .fetch();

      return {
        success: true,
        status: verification.status,
        message: `Verification status: ${verification.status}`
      };
    } catch (error) {
      console.error('Error checking verification status:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to check verification status'
      };
    }
  }

  /**
   * Cancel verification attempt
   */
  async cancelVerification(sid) {
    try {
      if (!this.initialized) {
        return {
          success: true,
          message: 'Mock verification cancelled'
        };
      }

      await this.client.verify.v2
        .services(this.serviceSid)
        .verifications(sid)
        .update({ status: 'cancelled' });

      return {
        success: true,
        message: 'Verification cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling verification:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to cancel verification'
      };
    }
  }
}

module.exports = new TwilioService();
