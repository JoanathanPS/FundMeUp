import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Shield,
  Brain,
  Database,
  Sparkles,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailVerificationProps {
  onVerificationComplete?: (verificationId: string) => void
  onStepComplete?: (step: string) => void
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  onVerificationComplete,
  onStepComplete 
}) => {
  const [step, setStep] = useState<'email' | 'otp' | 'complete'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [studentName, setStudentName] = useState('')
  const [institution, setInstitution] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [mockCode, setMockCode] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !studentName || !institution) {
      toast.error('Please fill in all fields')
      return
    }

    // Validate educational email domain
    const educationalDomains = [
      'edu', 'ac.in', 'iit.ac.in', 'nit.ac.in', 'iisc.ac.in',
      'iim.ac.in', 'iiser.ac.in', 'tifr.res.in', 'tiss.edu',
      'du.ac.in', 'jnu.ac.in', 'amrita.edu', 'manipal.edu'
    ]

    const emailDomain = email.split('@')[1]?.toLowerCase()
    const isEducationalEmail = educationalDomains.some(domain => 
      emailDomain?.endsWith(domain)
    )

    if (!isEducationalEmail) {
      toast.error('Please use your official college/university email address')
      return
    }

    setIsLoading(true)
    try {
      // Mock API call to request email verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockVerificationId = `verify_${Date.now()}`
      const mockOtpCode = '123456'
      
      setVerificationId(mockVerificationId)
      setMockCode(mockOtpCode)
      setStep('otp')
      onStepComplete?.('email_requested')
      
      toast.success('📧 Verification email sent! Check your inbox.')
    } catch (error) {
      console.error('Email verification request failed:', error)
      toast.error('Failed to send verification email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode) {
      toast.error('Please enter the verification code')
      return
    }

    setIsLoading(true)
    try {
      // Mock API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const isValidCode = otpCode === mockCode || otpCode === '000000'
      
      if (isValidCode) {
        setStep('complete')
        onStepComplete?.('email_verified')
        onVerificationComplete?.(verificationId!)
        
        toast.success('✅ Email verified successfully!')
      } else {
        toast.error('Invalid verification code. Please try again.')
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
      toast.error('Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (stepName: string, isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    if (isActive) {
      return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
    }
    return <Clock className="h-6 w-6 text-gray-400" />
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Email Verification
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Verify your official college email to complete the verification process
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          {getStepIcon('email', step === 'email', step !== 'email')}
          <span className={`text-sm font-medium ${
            step === 'email' ? 'text-blue-600' : 
            (step === 'otp' || step === 'complete') ? 'text-green-600' : 'text-gray-500'
          }`}>
            Enter Email
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4" />
        <div className="flex items-center space-x-2">
          {getStepIcon('otp', step === 'otp', step === 'complete')}
          <span className={`text-sm font-medium ${
            step === 'otp' ? 'text-blue-600' : 
            step === 'complete' ? 'text-green-600' : 'text-gray-500'
          }`}>
            Verify Code
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4" />
        <div className="flex items-center space-x-2">
          {getStepIcon('complete', step === 'complete', false)}
          <span className={`text-sm font-medium ${
            step === 'complete' ? 'text-green-600' : 'text-gray-500'
          }`}>
            Complete
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Email Input */}
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Enter your college/university name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  College Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use your official college/university email address
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Sending...' : 'Send Verification Email'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We've sent a verification code to <strong>{email}</strong>
              </p>
              
              {/* Demo Mode Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Demo Mode:</strong> Use code <span className="font-mono font-bold">{mockCode}</span> or <span className="font-mono font-bold">000000</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg font-mono"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 btn-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>{isLoading ? 'Verifying...' : 'Verify Code'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your college email has been successfully verified.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Step 3 of 3 Complete</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email verification complete. AI and Regional verification in progress...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmailVerification
