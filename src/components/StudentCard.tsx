import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Target, 
  Heart,
  ExternalLink,
  Award,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'
import DonationModal from './DonationModal'

interface Student {
  id: string
  wallet: string
  dream: string
  field: string
  year: number
  country: string
  introVideoCID?: string
  milestones: Array<{
    id: string
    title: string
    description: string
    targetDate: string
    status: 'pending' | 'in_progress' | 'completed' | 'verified'
    mediaCID?: string
  }>
  verifiedByInstitution?: boolean
  institutionName?: string
  totalFunded?: number
  progress?: number
}

interface StudentCardProps {
  student: Student
  onDonate?: (studentId: string, amount: number) => void
  onViewProfile?: (studentId: string) => void
  showDonateButton?: boolean
}

const StudentCard = ({ 
  student, 
  onDonate, 
  onViewProfile, 
  showDonateButton = true 
}: StudentCardProps) => {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const completedMilestones = student.milestones?.filter(m => m.status === 'completed' || m.status === 'verified').length || 0
  const totalMilestones = student.milestones?.length || 0
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const handleDonate = (amount: number) => {
    onDonate?.(student.id, amount)
    setShowDonationModal(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="card-hover relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Verification Badge */}
        {student.verifiedByInstitution && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              <Award className="h-3 w-3" />
              <span>Verified</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {student.dream}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <GraduationCap className="h-4 w-4" />
                <span>{student.field}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{student.country}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Year {student.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {completedMilestones}/{totalMilestones} milestones
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Milestones Preview */}
        {student.milestones && student.milestones.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recent Milestones
            </h4>
            <div className="space-y-2">
              {student.milestones.slice(0, 2).map((milestone, index) => (
                <div key={milestone.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    milestone.status === 'completed' || milestone.status === 'verified' 
                      ? 'bg-green-500' 
                      : milestone.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {student.totalFunded ? `$${student.totalFunded.toLocaleString()}` : '$0'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Funded</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {showDonateButton && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDonationModal(true)}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Donate</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewProfile?.(student.id)}
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View</span>
          </motion.button>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          student={student}
          onDonate={handleDonate}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </>
  )
}

export default StudentCard