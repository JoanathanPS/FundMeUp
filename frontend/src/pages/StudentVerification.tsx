import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { verificationAPI } from '@/services/api'
import StateCityInstitutionSelector from '@/components/StateCityInstitutionSelector'

const StudentVerification = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [studentName, setStudentName] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('')
  const [customInstitution, setCustomInstitution] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [verificationId, setVerificationId] = useState('')

  // Allowed academic domains
  const allowedDomains = [
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
    'kiit.ac.in'
  ]

  const validateEmail = (email: string) => {
    const emailDomain = email.split('@')[1]?.toLowerCase()
    return allowedDomains.some(domain => emailDomain?.endsWith(domain))
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get final institution name
    const finalInstitution = selectedInstitution === 'unknown' || selectedInstitution === 'custom' 
      ? customInstitution 
      : selectedInstitution
    
    if (!email || !studentName || !selectedState || !selectedCity || !finalInstitution) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please use your official college/university email address')
      return
    }

    setIsLoading(true)
    try {
      const response = await verificationAPI.requestEmailVerification({
        email,
        studentName,
        institution: `${finalInstitution}, ${selectedCity}, ${selectedState}`
      })

      if (response.success) {
        setVerificationId(response.verificationId)
        setStep('otp')
        toast.success('📧 Verification code sent to your email!')
      } else {
        toast.error(response.message || 'Failed to send verification code')
      }
    } catch (error) {
      console.error('Email verification request failed:', error)
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      const response = await verificationAPI.verifyEmailCode({
        verificationId,
        code: otpCode
      })

      if (response.success) {
        toast.success('🎉 Email verified successfully!')
        navigate('/student', { 
          state: { 
            message: 'Email verification completed! You can now access all student features.',
            verified: true 
          }
        })
      } else {
        toast.error(response.message || 'Invalid verification code')
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
      toast.error('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    if (!verificationId) return
    
    setIsLoading(true)
    try {
      const finalInstitution = selectedInstitution === 'unknown' || selectedInstitution === 'custom' 
        ? customInstitution 
        : selectedInstitution

      const response = await verificationAPI.requestEmailVerification({
        email,
        studentName,
        institution: finalInstitution
      })

      if (response.success) {
        toast.success('📧 New verification code sent!')
      } else {
        toast.error('Failed to resend code')
      }
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/student" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Student Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold text-white">Student Verification</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step === 'email' ? 'text-orange-500' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'email' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">Email</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center space-x-2 ${step === 'otp' ? 'text-orange-500' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'otp' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="font-medium">Verify</span>
              </div>
            </div>
          </div>

          {step === 'email' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Verify Your Academic Email
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your official college/university email to verify your student identity
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* State, City, and Institution Selector */}
                <StateCityInstitutionSelector
                  selectedState={selectedState}
                  onStateChange={setSelectedState}
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                  selectedInstitution={selectedInstitution}
                  onInstitutionChange={setSelectedInstitution}
                  customInstitution={customInstitution}
                  onCustomInstitutionChange={setCustomInstitution}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Academic Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 192472229.simats@saveetha.com"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Supported domains: saveetha.com, vitstudent.ac.in, ssn.edu.in, edu.in, ac.in, and more
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Verification Code
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit code to <span className="font-semibold text-orange-500">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type={showOtp ? 'text' : 'password'}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showOtp ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Verify Email</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={isLoading}
                    className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Security & Privacy
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your email verification is secure and encrypted. We only use your academic email 
                  to verify your student status and will never share your personal information.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentVerification
