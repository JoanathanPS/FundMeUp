import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, TrendingUp } from 'lucide-react'

interface ProfileProgressMeterProps {
  progress: number // 0-100
  completedFields: number
  totalFields: number
  onComplete?: () => void
}

interface Checkpoint {
  label: string
  completed: boolean
}

const ProfileProgressMeter: React.FC<ProfileProgressMeterProps> = ({
  progress,
  completedFields,
  totalFields,
  onComplete
}) => {
  const checkpoints: Checkpoint[] = [
    { label: 'Basic Info', completed: progress >= 25 },
    { label: 'Academic Details', completed: progress >= 50 },
    { label: 'Verification', completed: progress >= 75 },
    { label: 'Complete Profile', completed: progress >= 100 }
  ]

  const getProgressColor = () => {
    if (progress < 25) return 'from-red-500 to-orange-500'
    if (progress < 50) return 'from-orange-500 to-yellow-500'
    if (progress < 75) return 'from-yellow-500 to-green-500'
    return 'from-green-500 to-emerald-600'
  }

  const getProgressMessage = () => {
    if (progress === 100) return '🎉 Profile complete! You\'re all set!'
    if (progress >= 75) return 'Almost there! Just a few more details needed.'
    if (progress >= 50) return 'Good progress! Keep it up!'
    if (progress >= 25) return 'You\'re off to a great start!'
    return 'Complete your profile to get started.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Profile Progress
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">
            {progress}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {completedFields}/{totalFields} fields
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
        <motion.div
          className={`h-full bg-gradient-to-r ${getProgressColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear'
          }}
        />
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
        {getProgressMessage()}
      </p>

      {/* Checkpoints */}
      <div className="grid grid-cols-2 gap-3">
        {checkpoints.map((checkpoint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              checkpoint.completed
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            {checkpoint.completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
            <span
              className={`text-sm font-medium ${
                checkpoint.completed
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {checkpoint.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Action Button (only show if not complete) */}
      {progress < 100 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Complete Your Profile
        </motion.button>
      )}
    </motion.div>
  )
}

export default ProfileProgressMeter

