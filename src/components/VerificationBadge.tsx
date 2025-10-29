import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Shield } from 'lucide-react'

interface VerificationBadgeProps {
  isVerified: boolean
  isPending?: boolean
  verificationType?: 'email' | 'ai' | 'regional' | 'full'
  className?: string
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  isPending = false,
  verificationType = 'email',
  className = ''
}) => {
  const getBadgeContent = () => {
    if (isPending) {
      return {
        icon: Clock,
        text: 'Verification Pending',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      }
    }

    if (isVerified) {
      return {
        icon: CheckCircle,
        text: getVerifiedText(),
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800'
      }
    }

    return {
      icon: XCircle,
      text: 'Not Verified',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  }

  const getVerifiedText = () => {
    switch (verificationType) {
      case 'email':
        return 'Email Verified'
      case 'ai':
        return 'AI Verified'
      case 'regional':
        return 'Region Verified'
      case 'full':
        return 'Fully Verified'
      default:
        return 'Verified'
    }
  }

  const getTooltipText = () => {
    if (isPending) {
      return 'Your verification is being processed. Please wait for confirmation.'
    }

    if (isVerified) {
      switch (verificationType) {
        case 'email':
          return 'This student\'s identity has been confirmed via academic email verification.'
        case 'ai':
          return 'This student\'s documents have been verified by AI analysis.'
        case 'regional':
          return 'This student\'s institution has been verified against regional databases.'
        case 'full':
          return 'This student has completed all verification steps and is fully verified.'
        default:
          return 'This student has been verified.'
      }
    }

    return 'This student has not completed verification yet.'
  }

  const badgeContent = getBadgeContent()
  const Icon = badgeContent.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium ${badgeContent.bgColor} ${badgeContent.borderColor} ${badgeContent.color} ${className}`}
      title={getTooltipText()}
    >
      <Icon className="h-4 w-4" />
      <span>{badgeContent.text}</span>
      {verificationType === 'full' && isVerified && (
        <Shield className="h-3 w-3 text-green-600" />
      )}
    </motion.div>
  )
}

export default VerificationBadge
