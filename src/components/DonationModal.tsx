import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Heart, DollarSign, TrendingUp, Shield, Award, CheckCircle, Sparkles } from 'lucide-react'
import { useWeb3 } from '@/services/web3'
import { scholarshipAPI } from '@/services/api'
import toast from 'react-hot-toast'
import { donationStorage } from '@/utils/donationStorage'

interface Student {
  id: string
  wallet: string
  dream: string
  field: string
  totalFunded?: number
}

interface DonationModalProps {
  student: Student
  onDonate: (amount: number) => void
  onClose: () => void
}

const DonationModal = ({ student, onDonate, onClose }: DonationModalProps) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)
  const { address, isConnected } = useWeb3()

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000] // INR amounts

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      // Save donation to local storage
      const savedDonation = donationStorage.saveDonation({
        studentId: student.id,
        studentName: student.dream,
        amount: parseFloat(amount),
        milestone: message || 'General Support',
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      })

      console.log('Donation saved:', savedDonation)
      
      setDonationSuccess(true)
      toast.success(`🎉 Donation of ₹${amount} successful!`)
      
      // Show success state for 3 seconds then close
      setTimeout(() => {
        setDonationSuccess(false)
        onDonate(parseFloat(amount))
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Failed to process donation. Please try again.')
      setIsLoading(false)
    }
  }

  if (donationSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full text-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Donation Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for supporting {student.dream}
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">₹{amount} donated</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaction will be processed on blockchain
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Support {student.dream}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {student.field} • Year {student.year}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Student Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Student's Dream
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {student.dream}
              </p>
              {student.totalFunded && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>Already funded: ₹{student.totalFunded?.toLocaleString() || '0'}</span>
                </div>
              )}
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Amount (INR)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      amount === preset.toString()
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500'
                    }`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="input pl-10"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Encouragement Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to encourage this student..."
                className="input h-20 resize-none"
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.length}/200
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Your Impact
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 90% goes directly to the student</li>
                <li>• 10% goes to their savings wallet</li>
                <li>• Earn Impact Tokens for your contribution</li>
                <li>• Track progress through blockchain</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    <span>Donate ₹{amount || '0'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Demo Mode Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-200">
                💡 Demo Mode: Donations are saved locally. Connect wallet for blockchain transactions.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DonationModal


