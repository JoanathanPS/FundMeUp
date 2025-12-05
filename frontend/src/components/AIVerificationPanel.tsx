import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Brain, 
  Shield, 
  TrendingUp,
  Clock,
  FileText,
  Award,
  MapPin,
  Database,
  Sparkles,
  HelpCircle,
  Loader2
} from 'lucide-react'
import RegionalDataService from '../services/regionalData'

interface AIVerificationPanelProps {
  analysis: {
    riskScore: number
    confidence: number
    reasoning: string
    flags: string[]
    recommendations: string[]
    documentAnalysis: {
      quality: 'high' | 'medium' | 'low'
      authenticity: 'verified' | 'suspicious' | 'unclear'
      completeness: 'complete' | 'partial' | 'insufficient'
    }
    verdict: 'approve' | 'review' | 'reject'
    aiModel?: string
    analyzedAt?: string
  }
  studentInfo?: {
    institution?: string
    region?: string
    gpa?: number
    name?: string
  }
  onOverride?: (action: 'approve' | 'reject') => void
  showOverride?: boolean
  isProcessing?: boolean
}

const AIVerificationPanel: React.FC<AIVerificationPanelProps> = ({ 
  analysis, 
  studentInfo,
  onOverride, 
  showOverride = false,
  isProcessing = false
}) => {
  const regionalService = RegionalDataService.getInstance()
  
  // Check regional verification if student info is provided
  const regionalVerification = studentInfo?.institution && studentInfo?.region 
    ? regionalService.verifyInstitution(studentInfo.institution, studentInfo.region)
    : null

  // Enhanced Smart Verification Logic
  const isSmartVerified = 
    analysis.verdict === 'approve' && 
    analysis.confidence > 85 && 
    regionalVerification?.verified
  
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600'
    if (score <= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskBg = (score: number) => {
    if (score <= 30) return 'bg-green-100 dark:bg-green-900/20'
    if (score <= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'approve':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'review':
        return <Clock className="h-6 w-6 text-yellow-500" />
      case 'reject':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'approve':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'review':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'reject':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Verification Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by {analysis.aiModel || 'Llama 3.1'} • {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>
        {getVerdictIcon(analysis.verdict)}
      </div>

      {/* Risk Score & Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg ${getRiskBg(analysis.riskScore)} relative`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Score
              </span>
              <div 
                className="relative"
                onMouseEnter={() => setShowTooltip('risk')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                {showTooltip === 'risk' && (
                  <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                    Risk score (0-100) indicates the probability of fraud. Lower scores are better. Based on document authenticity, consistency, and pattern analysis.
                  </div>
                )}
              </div>
            </div>
            <Shield className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <motion.div
                  className={`h-2 rounded-full ${
                    analysis.riskScore <= 30 ? 'bg-green-500' :
                    analysis.riskScore <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.riskScore}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            <span className={`text-2xl font-bold ${getRiskColor(analysis.riskScore)}`}>
              {analysis.riskScore}
            </span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI Confidence
              </span>
              <div 
                className="relative"
                onMouseEnter={() => setShowTooltip('confidence')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                {showTooltip === 'confidence' && (
                  <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                    AI confidence (0-100%) represents how certain the AI is about its analysis. Calculated from document quality, pattern matching, and verification checks.
                  </div>
                )}
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <motion.div
                  className="h-2 rounded-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidence}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {analysis.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`p-4 rounded-lg border-2 ${getVerdictColor(analysis.verdict)}`}>
        <div className="flex items-center space-x-3">
          {getVerdictIcon(analysis.verdict)}
          <div>
            <h4 className="font-semibold capitalize">
              {analysis.verdict === 'approve' ? 'Approved' : 
               analysis.verdict === 'review' ? 'Needs Review' : 'Rejected'}
            </h4>
            <p className="text-sm opacity-80">
              {analysis.verdict === 'approve' ? 'This proof has been verified and approved' :
               analysis.verdict === 'review' ? 'Manual review recommended before approval' :
               'This proof has been rejected due to high risk factors'}
            </p>
          </div>
        </div>
      </div>

      {/* Regional Verification */}
      {regionalVerification && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`p-4 rounded-lg border-2 ${
            regionalVerification.verified 
              ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
              : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              regionalVerification.verified 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
              <Database className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Regional Verification
                </h4>
                {regionalVerification.verified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {regionalVerification.reasoning}
              </p>
              {regionalVerification.institutionData && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Institution: {'schoolName' in regionalVerification.institutionData ? regionalVerification.institutionData.schoolName : ('name' in regionalVerification.institutionData ? regionalVerification.institutionData.name : 'Unknown')}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Smart Verification Badge */}
      {isSmartVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 rounded-lg border-2 border-gradient-to-r from-purple-200 to-blue-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>Smart Verification</span>
                <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                  AI + Regional
                </div>
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This student has been verified by both AI analysis and regional government database. 
                Highest confidence level achieved.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Reasoning */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>AI Analysis</span>
        </h4>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.reasoning}
          </p>
        </div>
      </div>

      {/* Flags & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.flags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Risk Flags</span>
            </h4>
            <div className="space-y-2">
              {analysis.flags.map((flag, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-500" />
            <span>Recommendations</span>
          </h4>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Analysis */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Document Quality Assessment
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${
              analysis.documentAnalysis.quality === 'high' ? 'bg-green-100 text-green-800' :
              analysis.documentAnalysis.quality === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.documentAnalysis.quality.toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quality</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${
              analysis.documentAnalysis.authenticity === 'verified' ? 'bg-green-100 text-green-800' :
              analysis.documentAnalysis.authenticity === 'suspicious' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {analysis.documentAnalysis.authenticity.toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Authenticity</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${
              analysis.documentAnalysis.completeness === 'complete' ? 'bg-green-100 text-green-800' :
              analysis.documentAnalysis.completeness === 'partial' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.documentAnalysis.completeness.toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completeness</p>
          </div>
        </div>
      </div>

      {/* Override Actions */}
      {showOverride && onOverride && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-gray-500" />
            <span>Admin Override</span>
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Manually override the AI decision in special cases. Use with caution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOverride('approve')}
              disabled={isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Force Approve</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOverride('reject')}
              disabled={isProcessing}
              className="btn-outline border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Force Reject</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AIVerificationPanel
