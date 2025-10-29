import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Brain, 
  Database, 
  CheckCircle, 
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle
} from 'lucide-react'
import VerificationStatus from '@/components/VerificationStatus'

const VerificationDemo = () => {
  const [currentStep, setCurrentStep] = useState<'overview' | 'email' | 'ai' | 'regional' | 'complete'>('overview')
  const [verificationComplete, setVerificationComplete] = useState(false)

  const steps = [
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your official college email address',
      icon: Mail,
      color: 'blue',
      details: [
        'Enter your college email address',
        'Receive OTP via Twilio Verify',
        'Enter verification code',
        'Email domain validation'
      ]
    },
    {
      id: 'ai',
      title: 'AI Document Analysis',
      description: 'AI analyzes your proof documents',
      icon: Brain,
      color: 'purple',
      details: [
        'Document authenticity check',
        'Content analysis and validation',
        'Risk score calculation',
        'Confidence level assessment'
      ]
    },
    {
      id: 'regional',
      title: 'Regional Database Check',
      description: 'Cross-reference with government databases',
      icon: Database,
      color: 'green',
      details: [
        'Institution verification',
        'Student eligibility check',
        'Performance score validation',
        'Government scheme compliance'
      ]
    }
  ]

  const handleVerificationComplete = (status: any) => {
    setVerificationComplete(true)
    setCurrentStep('complete')
  }

  const getStepColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600'
    }
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getStepBgColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20',
      purple: 'bg-purple-50 dark:bg-purple-900/20',
      green: 'bg-green-50 dark:bg-green-900/20'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-900/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            3-Step Student Verification
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our comprehensive verification process that combines email verification, 
            AI analysis, and regional database checks for maximum security and transparency.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Process Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Verification Process
            </h2>
            
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-6 rounded-xl border-2 ${
                  currentStep === step.id 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getStepColor(step.color)}`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Step {index + 1}: {step.title}
                      </h3>
                      {currentStep === step.id && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {step.description}
                    </p>
                    <ul className="space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Why 3-Step Verification?</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Maximum security and fraud prevention</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Compliance with educational standards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Transparent and auditable process</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated verification with human oversight</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {verificationComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Verification Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Congratulations! You have successfully completed all three verification steps.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Fully Verified Student</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You are now eligible for all funding opportunities and have earned your Soulbound NFT identity.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setVerificationComplete(false)
                    setCurrentStep('overview')
                  }}
                  className="mt-6 btn-outline"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <VerificationStatus
                wallet="0x1234...5678"
                onVerificationComplete={handleVerificationComplete}
              />
            )}
          </motion.div>
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Technical Implementation
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Twilio Verify</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Secure OTP delivery via email with educational domain validation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Groq/Llama 3.1 powered document analysis with confidence scoring
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Regional Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Government database integration for institutional verification
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerificationDemo
