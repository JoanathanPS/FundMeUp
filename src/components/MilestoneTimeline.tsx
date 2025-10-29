import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Award,
  Eye,
  Download,
  Brain
} from 'lucide-react'

interface Milestone {
  title: string
  description: string
  status: 'pending' | 'verified' | 'rejected'
  targetDate: string
  mediaCID?: string
  verifiedAt?: string
  aiScore?: number
  riskScore?: number
}

interface MilestoneTimelineProps {
  milestones: Milestone[]
  onViewProof?: (milestone: Milestone) => void
  onDownloadProof?: (milestone: Milestone) => void
  showAIAnalysis?: boolean
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ 
  milestones, 
  onViewProof, 
  onDownloadProof,
  showAIAnalysis = false 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      case 'rejected':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      default:
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
    }
  }

  const getProgressPercentage = () => {
    const verified = milestones.filter(m => m.status === 'verified').length
    return (verified / milestones.length) * 100
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Milestone Progress
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {milestones.filter(m => m.status === 'verified').length} of {milestones.length} completed
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {getProgressPercentage().toFixed(0)}% Complete
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative border rounded-lg p-4 ${getStatusColor(milestone.status)}`}
          >
            {/* Timeline Line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300 dark:bg-gray-600" />
            )}

            <div className="flex items-start space-x-4">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(milestone.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {milestone.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {milestone.status === 'verified' && showAIAnalysis && milestone.aiScore && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <Brain className="h-3 w-3" />
                        <span>AI: {milestone.aiScore}%</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      milestone.status === 'verified' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {milestone.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Due: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                  </div>
                  
                  {milestone.verifiedAt && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>Verified: {new Date(milestone.verifiedAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  {milestone.mediaCID && (
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>Proof Available</span>
                    </div>
                  )}
                </div>

                {/* AI Risk Score */}
                {showAIAnalysis && milestone.riskScore !== undefined && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI Risk Assessment
                      </span>
                      <span className={`text-sm font-bold ${
                        milestone.riskScore <= 30 ? 'text-green-600' :
                        milestone.riskScore <= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {milestone.riskScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${
                          milestone.riskScore <= 30 ? 'bg-green-500' :
                          milestone.riskScore <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${milestone.riskScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4">
                  {milestone.mediaCID && onViewProof && (
                    <button
                      onClick={() => onViewProof(milestone)}
                      className="btn-secondary flex items-center space-x-2 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Proof</span>
                    </button>
                  )}
                  
                  {milestone.mediaCID && onDownloadProof && (
                    <button
                      onClick={() => onDownloadProof(milestone)}
                      className="btn-outline flex items-center space-x-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  )}

                  {milestone.status === 'verified' && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified by AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {milestones.filter(m => m.status === 'verified').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {milestones.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {milestones.filter(m => m.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
        </div>
      </div>
    </div>
  )
}

export default MilestoneTimeline
