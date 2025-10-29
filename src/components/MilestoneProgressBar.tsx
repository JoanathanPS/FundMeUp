import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Award } from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'verified'
  mediaCID?: string
  verifiedAt?: string
}

interface MilestoneProgressBarProps {
  milestones: Milestone[]
  showDetails?: boolean
  onMilestoneClick?: (milestone: Milestone) => void
}

const MilestoneProgressBar = ({ 
  milestones, 
  showDetails = true, 
  onMilestoneClick 
}: MilestoneProgressBarProps) => {
  const completedCount = milestones.filter(m => m.status === 'completed' || m.status === 'verified').length
  const totalCount = milestones.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'pending':
        return 'bg-gray-300'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'verified':
        return 'Verified'
      case 'in_progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Milestone Progress
          </h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount}/{totalCount} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-3 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow-sm">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Milestones List */}
      {showDetails && (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                milestone.status === 'completed' || milestone.status === 'verified'
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : milestone.status === 'in_progress'
                  ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
              onClick={() => onMilestoneClick?.(milestone)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {milestone.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      milestone.status === 'completed' || milestone.status === 'verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : milestone.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {getStatusText(milestone.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Target: {new Date(milestone.targetDate).toLocaleDateString()}
                    </span>
                    {milestone.verifiedAt && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Verified: {new Date(milestone.verifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Award className="h-6 w-6" />
            <span className="font-semibold">Congratulations!</span>
          </div>
          <p className="text-sm">
            All milestones have been completed and verified. This student has achieved their goals!
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default MilestoneProgressBar

