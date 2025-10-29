import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, MapPin, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import AIVerificationPanel from '../components/AIVerificationPanel'

const AIDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState<'approve' | 'review' | 'reject'>('approve')

  const demoData = {
    approve: {
      analysis: {
        riskScore: 14,
        confidence: 91,
        reasoning: "Document analysis shows high authenticity with clear institutional letterhead, proper signatures, and consistent formatting. The academic transcript matches expected patterns for IIT Delhi Computer Science program. No signs of manipulation or fraud detected.",
        flags: [],
        recommendations: ["Approve milestone", "Release funds automatically", "Student eligible for next milestone"],
        documentAnalysis: {
          quality: 'high',
          authenticity: 'verified',
          completeness: 'complete'
        },
        verdict: 'approve' as const,
        aiModel: 'Llama 3.1 70B',
        analyzedAt: new Date().toISOString()
      },
      studentInfo: {
        institution: 'Indian Institute of Technology Delhi',
        region: 'kerala',
        gpa: 8.7
      }
    },
    review: {
      analysis: {
        riskScore: 45,
        confidence: 72,
        reasoning: "Document shows some inconsistencies in formatting and the grade distribution appears unusual. While the institution letterhead looks authentic, the signature verification is unclear. Additional verification recommended before approval.",
        flags: ["Unusual grade distribution", "Signature verification unclear", "Formatting inconsistencies"],
        recommendations: ["Manual review required", "Request additional documentation", "Verify with institution directly"],
        documentAnalysis: {
          quality: 'medium',
          authenticity: 'unclear',
          completeness: 'partial'
        },
        verdict: 'review' as const,
        aiModel: 'Llama 3.1 70B',
        analyzedAt: new Date().toISOString()
      },
      studentInfo: {
        institution: 'St. Thomas Central School',
        region: 'kerala',
        gpa: 7.2
      }
    },
    reject: {
      analysis: {
        riskScore: 78,
        confidence: 89,
        reasoning: "Multiple red flags detected: document appears to be digitally altered, grade patterns are inconsistent with institutional standards, and signature verification failed. High probability of fraudulent submission.",
        flags: ["Digital alteration detected", "Grade pattern inconsistencies", "Signature verification failed", "Institution mismatch"],
        recommendations: ["Reject submission", "Flag for investigation", "Request original documents"],
        documentAnalysis: {
          quality: 'low',
          authenticity: 'suspicious',
          completeness: 'insufficient'
        },
        verdict: 'reject' as const,
        aiModel: 'Llama 3.1 70B',
        analyzedAt: new Date().toISOString()
      },
      studentInfo: {
        institution: 'Unknown Institution',
        region: 'kerala',
        gpa: 6.1
      }
    }
  }

  const currentDemo = demoData[selectedDemo]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Verification Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our AI-powered verification system with regional data integration. 
            See how we analyze student documents and provide detailed reasoning.
          </p>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Try Different Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedDemo('approve')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDemo === 'approve'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${
                  selectedDemo === 'approve' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Approved Case
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    High confidence, verified institution
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDemo('review')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDemo === 'review'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-6 w-6 ${
                  selectedDemo === 'review' ? 'text-yellow-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Review Case
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Medium confidence, needs verification
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDemo('reject')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDemo === 'reject'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <XCircle className={`h-6 w-6 ${
                  selectedDemo === 'reject' ? 'text-red-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Rejected Case
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    High risk, suspicious document
                  </div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* AI Verification Panel */}
        <motion.div
          key={selectedDemo}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AIVerificationPanel
            analysis={currentDemo.analysis}
            studentInfo={currentDemo.studentInfo}
            showOverride={true}
            onOverride={(action) => {
              console.log(`Override: ${action}`)
            }}
          />
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced AI analyzes documents with detailed reasoning, confidence scores, and risk assessment.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Regional Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cross-referenced with government databases to verify institutional credibility and student eligibility.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Smart Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Combines AI analysis with regional data for the highest confidence verification possible.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AIDemo
