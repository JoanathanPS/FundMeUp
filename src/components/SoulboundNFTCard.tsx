import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  Award, 
  Calendar, 
  Building, 
  GraduationCap,
  ExternalLink,
  Copy,
  QrCode
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SoulboundNFTData {
  tokenId: string
  student: string
  institution: string
  field: string
  aiScore: number
  verifiedDate: string
  verifier: string
  isActive: boolean
}

interface SoulboundNFTCardProps {
  nftData: SoulboundNFTData
  onViewOnBlockchain?: () => void
  onShare?: () => void
}

const SoulboundNFTCard: React.FC<SoulboundNFTCardProps> = ({ 
  nftData, 
  onViewOnBlockchain,
  onShare 
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const getFieldIcon = (field: string) => {
    const fieldLower = field.toLowerCase()
    if (fieldLower.includes('computer') || fieldLower.includes('engineering')) {
      return '💻'
    } else if (fieldLower.includes('medicine') || fieldLower.includes('health')) {
      return '🏥'
    } else if (fieldLower.includes('business') || fieldLower.includes('management')) {
      return '💼'
    } else if (fieldLower.includes('arts') || fieldLower.includes('design')) {
      return '🎨'
    } else if (fieldLower.includes('science') || fieldLower.includes('research')) {
      return '🔬'
    }
    return '🎓'
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card p-6 max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Verified Student Identity
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Soulbound NFT • Non-transferable
        </p>
      </div>

      {/* NFT Details */}
      <div className="space-y-4">
        {/* Student Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {nftData.student}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Student
            </div>
          </div>
        </div>

        {/* Institution */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Building className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {nftData.institution}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Institution
            </div>
          </div>
        </div>

        {/* Field of Study */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-2xl">{getFieldIcon(nftData.field)}</span>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {nftData.field}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Field of Study
            </div>
          </div>
        </div>

        {/* AI Verification Score */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Verification Score
            </span>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getAIScoreColor(nftData.aiScore)}`}>
              {nftData.aiScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <motion.div
              className={`h-2 rounded-full ${
                nftData.aiScore >= 80 ? 'bg-green-500' :
                nftData.aiScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${nftData.aiScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Verification Date */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Calendar className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {new Date(nftData.verifiedDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Verified Date
            </div>
          </div>
        </div>

        {/* Verifier */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Award className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white truncate">
              {nftData.verifier}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Verifier
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-6 text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          nftData.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        }`}>
          <CheckCircle className="h-4 w-4" />
          <span>{nftData.isActive ? 'Active' : 'Revoked'}</span>
        </div>
      </div>

      {/* Token ID */}
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Token ID
            </div>
            <div className="font-mono text-sm text-gray-900 dark:text-white">
              #{nftData.tokenId}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(nftData.tokenId)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-3">
        {onViewOnBlockchain && (
          <button
            onClick={onViewOnBlockchain}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on Blockchain</span>
          </button>
        )}
        
        {onShare && (
          <button
            onClick={onShare}
            className="btn-outline flex items-center justify-center space-x-2 px-4"
          >
            <QrCode className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Blockchain Proof */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This NFT is permanently bound to your wallet and cannot be transferred.
          It serves as your verified student identity on the FundMeUp platform.
        </p>
      </div>
    </motion.div>
  )
}

export default SoulboundNFTCard
