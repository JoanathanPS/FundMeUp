import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Gift, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowDown
} from 'lucide-react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
import { calculateDonationFees, estimateGas, fetchETHPriceINR } from '@/utils/feeCalculator'

interface Student {
  id: string
  name: string
  wallet: string
  dream: string
  field: string
  progress: number
}

interface DonationModalProps {
  student: Student
  onClose: () => void
  onSuccess?: (txHash: string, amount: number) => void
}

const EnhancedDonationModal: React.FC<DonationModalProps> = ({
  student,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [showNFT, setShowNFT] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [feeBreakdown, setFeeBreakdown] = useState<any>(null)
  const [step, setStep] = useState<'amount' | 'confirm' | 'processing' | 'success'>('amount')

  const presetAmounts = [1000, 5000, 10000, 25000, 50000]

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateFees()
    }
  }, [amount])

  const calculateFees = async () => {
    try {
      const ethPrice = await fetchETHPriceINR()
      const mockGasEstimate = {
        gasPrice: '20',
        gasLimit: '21000',
        estimatedCost: 0.00042,
        estimatedCostINR: 15
      }
      
      const fees = calculateDonationFees(
        parseFloat(amount),
        ethPrice,
        mockGasEstimate,
        showNFT ? 25 : 0 // Convenience fee for NFT
      )
      
      setFeeBreakdown(fees)
    } catch (error) {
      console.error('Fee calculation failed:', error)
    }
  }

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setStep('processing')
    setIsProcessing(true)

    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      setStep('success')
      toast.success('Donation successful! 🎉')
      
      setTimeout(() => {
        onSuccess?.(txHash, parseFloat(amount))
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Donation failed:', error)
      toast.error('Donation failed. Please try again.')
      setIsProcessing(false)
      setStep('confirm')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Support {student.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {student.field} • {student.progress}% Complete
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {step === 'amount' && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        amount === preset.toString()
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-bold text-gray-900 dark:text-white">₹{preset.toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or enter custom amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="₹0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                </div>

                {/* NFT Option */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={showNFT}
                      onChange={(e) => setShowNFT(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Receive NFT Proof of Donation
                        </h4>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          +₹25
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Get a unique NFT badge to commemorate your contribution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share words of encouragement..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Fee Breakdown Toggle */}
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Where your money goes
                    </span>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-gray-600 transition-transform ${showBreakdown ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showBreakdown && feeBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Donation Amount</span>
                          <span className="font-semibold text-gray-900 dark:text-white">₹{feeBreakdown.donationAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Platform Fee ({feeBreakdown.platformFeePercent}%)</span>
                          <span className="font-semibold text-red-600">-₹{feeBreakdown.platformFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Reserve Pool ({feeBreakdown.reservePoolPercent}%)</span>
                          <span className="font-semibold text-blue-600">-₹{feeBreakdown.reservePoolFee.toLocaleString('en-IN')}</span>
                        </div>
                        {showNFT && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">NFT Mint Fee</span>
                            <span className="font-semibold text-gray-600">₹{feeBreakdown.convenienceFee}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Student Receives</span>
                            <span className="text-lg font-bold text-green-600">₹{feeBreakdown.studentReceives.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Plus gas fees (~₹{feeBreakdown.gasFee.toLocaleString('en-IN')})
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Confirm Button */}
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Donation
                </button>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Confirm Your Donation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review the details before proceeding
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{student.field}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">₹{Number(amount).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    {message && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{message}"</p>
                      </div>
                    )}
                    {showNFT && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        <div className="flex items-center space-x-2 text-purple-600">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">NFT badge included</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('amount')}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Confirm Donation
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                  <TrendingUp className="h-12 w-12 text-orange-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Processing Donation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we process your transaction...
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Donation Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for supporting {student.name}
                </p>
                {showNFT && (
                  <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-center space-x-2 text-purple-600">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-medium">Your NFT badge is being minted...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default EnhancedDonationModal

