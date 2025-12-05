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
import { useWeb3 } from '@/services/web3'
import { useAppMode } from '@/context/AppModeContext'

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
  const { isConnected, address } = useWeb3()
  const { isDemo } = useAppMode()
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const completedMilestones = student.milestones?.filter(m => m.status === 'completed' || m.status === 'verified').length || 0
  const totalMilestones = student.milestones?.length || 0
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const handleDonate = (amount: number) => {
    if (isDemo || !address) return
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
        className="relative flex h-full flex-col rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Verification Badge - Top Right */}
        {student.verifiedByInstitution && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 text-[11px] font-medium text-slate-950 px-2 py-0.5 z-10">
            <span className="h-3 w-3 rounded-full bg-emerald-900/70 flex items-center justify-center text-[9px] text-emerald-100">
              ✓
            </span>
            Verified
          </span>
        )}

        {/* Main Content - Flex-1 for alignment */}
        <div className="flex-1">

          {/* Header */}
          <div className="mb-4 pr-20">
            <h3 className="text-lg font-semibold text-white mb-1">
              {student.dream || ''}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              {student.field && (
                <div className="flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{student.field}</span>
                </div>
              )}
              {student.country && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{student.country}</span>
                </div>
              )}
              {student.year > 0 && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Year {student.year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-400">
                {completedMilestones}/{totalMilestones} milestones
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
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
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Recent Milestones
              </h4>
              <div className="space-y-2">
                {student.milestones.slice(0, 2).map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      milestone.status === 'completed' || milestone.status === 'verified' 
                        ? 'bg-green-500' 
                        : milestone.status === 'in_progress'
                        ? 'bg-yellow-500'
                        : 'bg-slate-500'
                    }`} />
                    <span className="text-sm text-slate-400 truncate">
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Amounts + Buttons - Fixed at bottom */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-700/50 pt-4">
          {/* Stats */}
          <div className="text-xs flex-1">
            <p className="text-slate-400 font-medium">
              ₹{student.totalFunded ? student.totalFunded.toLocaleString("en-IN") : '0'}
            </p>
            <p className="text-slate-500">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showDonateButton && (
              <motion.button
                whileHover={!isDemo && address ? { scale: 1.02 } : {}}
                whileTap={!isDemo && address ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (isDemo || !address) return
                  setShowDonationModal(true)
                }}
                disabled={isDemo || !address}
                className={`rounded-full px-3 py-2 text-xs font-semibold border transition ${
                  isDemo || !address
                    ? "bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed"
                    : "bg-transparent text-orange-400 border-orange-500 hover:bg-orange-500 hover:text-slate-950"
                }`}
                title={isDemo ? "Donations disabled (demo)" : !address ? "Connect wallet to donate" : "Donate"}
              >
                <Heart className="h-3 w-3 inline mr-1" />
                {isDemo
                  ? "Donations disabled (demo)"
                  : !address
                  ? "Connect wallet to donate"
                  : "Donate"}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewProfile?.(student.id)}
              className="rounded-full border border-orange-500 px-3 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500 hover:text-slate-950 transition"
            >
              <ExternalLink className="h-3 w-3 inline mr-1" />
              View
            </motion.button>
          </div>
        </div>

        {/* Demo helper text */}
        {isDemo && (
          <p className="mt-2 text-[10px] text-slate-500 text-center">
            Demo data – no real transactions.
          </p>
        )}

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


