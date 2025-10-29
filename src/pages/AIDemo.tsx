import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  HelpCircle,
  Sparkles,
  Loader2
} from 'lucide-react'
import AIVerificationPanel from '../components/AIVerificationPanel'
import { toast } from 'react-hot-toast'

interface AIDemoProps {}

const AIDemo: React.FC<AIDemoProps> = () => {
  const [selectedDemo, setSelectedDemo] = useState<'approved' | 'review' | 'rejected'>('approved')
  const [isProcessing, setIsProcessing] = useState(false)

  const demoData = {
    approved: {
      analysis: {
        riskScore: 14,
        confidence: 91,
        reasoning: "Document analysis shows high authenticity with clear institutional letterhead, proper signatures, and consistent formatting. The academic transcript matches expected patterns for IIT Delhi Computer Science program. Grade distribution follows normal academic standards. No signs of manipulation or fraud detected. Institution verification confirms legitimate registration.",
        flags: [],
        recommendations: ["Approve milestone immediately", "Release funds automatically", "Student eligible for next milestone", "Issue achievement badge"],
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
        gpa: 8.7,
        name: 'Priya Sharma'
      }
    },
    review: {
      analysis: {
        riskScore: 45,
        confidence: 72,
        reasoning: "Document shows some inconsistencies in formatting and the grade distribution appears unusual. While the institution letterhead looks authentic, the signature verification is unclear and dates don't align with academic calendar. Some sections show potential editing artifacts. Additional verification recommended before approval.",
        flags: ["Unusual grade distribution", "Signature verification unclear", "Formatting inconsistencies", "Date misalignment"],
        recommendations: ["Manual review required", "Request additional documentation", "Verify with institution directly", "Check against institutional records"],
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
        gpa: 7.2,
        name: 'Arjun Nair'
      }
    },
    rejected: {
      analysis: {
        riskScore: 78,
        confidence: 89,
        reasoning: "Multiple red flags detected: document appears to be digitally altered with compression artifacts visible. Grade patterns are inconsistent with institutional standards (too uniform, no variation). Signature verification failed with 96% mismatch probability. Institution name doesn't match any registered educational body. High probability of fraudulent submission.",
        flags: ["Digital alteration detected", "Grade pattern inconsistencies", "Signature verification failed", "Institution mismatch", "Compression artifacts visible"],
        recommendations: ["Reject submission immediately", "Flag for investigation", "Request original physical documents", "Report suspicious activity"],
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
        gpa: 6.1,
        name: 'Test User'
      }
    }
  }

  const currentDemo = demoData[selectedDemo]

  const handleOverride = async (action: 'approve' | 'reject') => {
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsProcessing(false)
    
    if (action === 'approve') {
      toast.success('✅ Milestone manually approved by admin')
    } else {
      toast.error('❌ Milestone manually rejected by admin')
    }
  }

  const handleScenarioChange = (scenario: 'approved' | 'review' | 'rejected') => {
    setSelectedDemo(scenario)
    toast.success(`Switched to ${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Interactive AI Verification Demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Verification System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our AI-powered verification system with regional data integration. 
            Switch between scenarios to see how we analyze different cases.
          </p>
        </motion.div>

        {/* Scenario Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>Try Different Scenarios</span>
            <HelpCircle className="h-5 w-5 text-gray-400 cursor-help" 
              title="Click on any scenario to see how AI analyzes different cases"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Approved Case Button */}
            <motion.button
              onClick={() => handleScenarioChange('approved')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedDemo === 'approved'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 transition-colors ${
                  selectedDemo === 'approved' ? 'text-green-600' : 'text-gray-400'
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
            </motion.button>

            {/* Review Case Button */}
            <motion.button
              onClick={() => handleScenarioChange('review')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedDemo === 'review'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-6 w-6 transition-colors ${
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
            </motion.button>

            {/* Rejected Case Button */}
            <motion.button
              onClick={() => handleScenarioChange('rejected')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedDemo === 'rejected'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <XCircle className={`h-6 w-6 transition-colors ${
                  selectedDemo === 'rejected' ? 'text-red-600' : 'text-gray-400'
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
            </motion.button>
          </div>
        </motion.div>

        {/* AI Verification Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDemo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AIVerificationPanel
              analysis={currentDemo.analysis}
              studentInfo={currentDemo.studentInfo}
              showOverride={true}
              onOverride={handleOverride}
              isProcessing={isProcessing}
            />
          </motion.div>
        </AnimatePresence>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced AI analyzes documents with detailed reasoning, confidence scores, and risk assessment.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Regional Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Cross-referenced with government databases to verify institutional credibility.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Smart Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Combines AI analysis with regional data for highest confidence verification.
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            🎯 How to Use This Demo
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
            <li>• <strong>Click scenario buttons</strong> to switch between different verification cases</li>
            <li>• <strong>View detailed AI reasoning</strong> for each case in the analysis panel</li>
            <li>• <strong>Check smart verification status</strong> when both AI and regional data agree</li>
            <li>• <strong>Test admin overrides</strong> using Force Approve/Reject buttons</li>
            <li>• <strong>Hover over tooltips</strong> to learn more about each metric</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default AIDemo