import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Brain, 
  Database, 
  Shield,
  Sparkles,
  Loader2,
  Mail
} from 'lucide-react'
import { VerificationStatus as VerificationStatusType } from '../services/verificationService'
import AIVerificationPanel from './AIVerificationPanel'
import EmailVerification from './EmailVerification'

interface VerificationStatusProps {
  wallet: string
  onVerificationComplete?: (status: VerificationStatusType) => void
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  wallet, 
  onVerificationComplete 
}) => {
  const [status, setStatus] = useState<VerificationStatusType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />
      case 'ai_reviewing':
        return <Brain className="h-6 w-6 text-blue-500" />
      case 'region_checking':
        return <Database className="h-6 w-6 text-purple-500" />
      case 'admin_review':
        return <Shield className="h-6 w-6 text-orange-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      case 'rejected':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      case 'ai_reviewing':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
      case 'region_checking':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20'
      case 'admin_review':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verification Complete! You are now a verified student.'
      case 'rejected':
        return 'Verification was rejected. Please check the requirements and try again.'
      case 'pending':
        return 'Verification request submitted. Please wait for processing.'
      case 'ai_reviewing':
        return 'AI is analyzing your documents. This may take a few minutes.'
      case 'region_checking':
        return 'Cross-checking with regional database. Almost there!'
      case 'admin_review':
        return 'Awaiting final admin approval. This is the last step!'
      default:
        return 'Unknown status. Please contact support.'
    }
  }

  const handleRequestVerification = async () => {
    setShowEmailVerification(true)
  }

  const handleEmailVerificationComplete = (verificationId: string) => {
    setCompletedSteps(prev => [...prev, 'email_verified'])
    setShowEmailVerification(false)
    
    // Start the AI + Regional verification process
    startAIAndRegionalVerification(verificationId)
  }

  const handleStepComplete = (step: string) => {
    setCompletedSteps(prev => [...prev, step])
  }

  const startAIAndRegionalVerification = async (verificationId: string) => {
    setIsLoading(true)
    try {
      // Mock verification process for demo
      const mockStatus = {
        status: 'ai_reviewing' as const,
        aiScore: 0,
        regionCheck: false,
        aiConfidence: 0,
        regionalVerified: false,
        adminApproved: false,
        verificationSteps: {
          aiVerification: false,
          regionalVerification: false,
          adminApproval: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setStatus(mockStatus)
      
      // Simulate AI verification
      setTimeout(() => {
        setStatus(prev => prev ? { 
          ...prev, 
          status: 'region_checking',
          aiScore: 87,
          aiConfidence: 91,
          verificationSteps: { ...prev.verificationSteps, aiVerification: true }
        } : null)
        setCompletedSteps(prev => [...prev, 'ai_verified'])
      }, 2000)
      
      // Simulate regional verification
      setTimeout(() => {
        setStatus(prev => prev ? { 
          ...prev, 
          status: 'admin_review',
          regionCheck: true,
          regionalVerified: true,
          verificationSteps: { ...prev.verificationSteps, regionalVerification: true }
        } : null)
        setCompletedSteps(prev => [...prev, 'regional_verified'])
      }, 4000)
      
      // Final verification
      setTimeout(() => {
        setStatus(prev => prev ? { 
          ...prev, 
          status: 'verified',
          adminApproved: true,
          verificationSteps: { ...prev.verificationSteps, adminApproval: true },
          soulboundNFT: `0x${Math.random().toString(16).substr(2, 40)}`
        } : null)
        setCompletedSteps(prev => [...prev, 'fully_verified'])
        onVerificationComplete?.(status!)
      }, 6000)
      
    } catch (error) {
      console.error('Verification request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (showEmailVerification) {
    return (
      <EmailVerification
        onVerificationComplete={handleEmailVerificationComplete}
        onStepComplete={handleStepComplete}
      />
    )
  }

  if (!status) {
    return (
      <div className="card p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          3-Step Student Verification
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Complete email verification, AI analysis, and regional checks to get fully verified.
        </p>
        
        {/* 3-Step Process Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">1. Email</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Verify college email</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">2. AI</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Document analysis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">3. Regional</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Database check</p>
          </div>
        </div>

        <button
          onClick={handleRequestVerification}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          <span>{isLoading ? 'Starting...' : 'Start Verification'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-6 border-2 ${getStatusColor(status.status)}`}
      >
        <div className="flex items-center space-x-4 mb-4">
          {getStatusIcon(status.status)}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {status.status.replace('_', ' ')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {getStatusMessage(status.status)}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              status.verificationSteps.aiVerification ? 'bg-green-500' : 'bg-gray-200'
            }`}>
              {status.verificationSteps.aiVerification ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <Brain className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI Document Analysis {status.verificationSteps.aiVerification ? '✓' : '⏳'}
            </span>
            {status.aiConfidence > 0 && (
              <span className="text-sm font-medium text-blue-600">
                {status.aiConfidence}% confidence
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              status.verificationSteps.regionalVerification ? 'bg-green-500' : 'bg-gray-200'
            }`}>
              {status.verificationSteps.regionalVerification ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <Database className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Regional Database Check {status.verificationSteps.regionalVerification ? '✓' : '⏳'}
            </span>
            {status.regionCheck && (
              <span className="text-sm font-medium text-purple-600">
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              status.verificationSteps.adminApproval ? 'bg-green-500' : 'bg-gray-200'
            }`}>
              {status.verificationSteps.adminApproval ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <Shield className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Admin Approval {status.verificationSteps.adminApproval ? '✓' : '⏳'}
            </span>
          </div>
        </div>

        {/* Soulbound NFT */}
        {status.soulboundNFT && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Soulbound NFT Minted!
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your verified student identity: {status.soulboundNFT}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* View AI Analysis Button */}
        {status.aiAnalysis && (
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="mt-4 btn-outline flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>View AI Analysis</span>
          </button>
        )}
      </motion.div>

      {/* AI Analysis Panel */}
      <AnimatePresence>
        {showAIPanel && status.aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AIVerificationPanel
              analysis={{
                ...status.aiAnalysis,
                documentAnalysis: {
                  quality: 'medium' as const,
                  authenticity: 'unclear' as const,
                  completeness: 'partial' as const
                },
                verdict: 'review' as const
              }}
              studentInfo={{
                institution: 'Indian Institute of Technology Delhi',
                region: 'kerala',
                gpa: 8.7
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VerificationStatus
