import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react'

interface NFTBadge {
  id: string
  tokenId: number
  name: string
  description: string
  image: string
  metadata: string
  mintedAt: string
  milestoneId?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

interface NFTBadgeDisplayProps {
  badge: NFTBadge
  showDetails?: boolean
  onClick?: (badge: NFTBadge) => void
}

const NFTBadgeDisplay = ({ badge, showDetails = true, onClick }: NFTBadgeDisplayProps) => {
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-yellow-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'common':
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityText = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return 'Legendary'
      case 'epic':
        return 'Epic'
      case 'rare':
        return 'Rare'
      case 'common':
      default:
        return 'Common'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-xl cursor-pointer ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={() => onClick?.(badge)}
    >
      {/* Badge Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with gradient */}
        <div className={`h-2 bg-gradient-to-r ${getRarityColor(badge.rarity)}`} />
        
        {/* Content */}
        <div className="p-4">
          {/* Badge Image */}
          <div className="relative mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            {badge.rarity && (
              <div className="absolute -top-1 -right-1">
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                  {getRarityText(badge.rarity)}
                </div>
              </div>
            )}
          </div>

          {/* Badge Info */}
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {badge.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {badge.description}
            </p>
          </div>

          {/* Details */}
          {showDetails && (
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span>Token ID</span>
                <span className="font-mono">#{badge.tokenId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Minted</span>
                <span>{new Date(badge.mintedAt).toLocaleDateString()}</span>
              </div>
              {badge.milestoneId && (
                <div className="flex items-center justify-between">
                  <span>Milestone</span>
                  <span className="truncate ml-2">{badge.milestoneId}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {onClick && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">View Details</span>
            </motion.button>
          )}
        </div>

        {/* Verification Badge */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
            <Shield className="h-3 w-3" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default NFTBadgeDisplay

