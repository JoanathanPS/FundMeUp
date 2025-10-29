import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', text: 'text-lg', subtitle: 'text-xs' },
    md: { icon: 'h-10 w-10', text: 'text-xl', subtitle: 'text-xs' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl', subtitle: 'text-sm' }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Custom Logo Icon */}
      <div className="relative">
        {/* Main Circle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg"></div>
        
        {/* SVG Logo */}
        <svg 
          width={size === 'sm' ? 32 : size === 'md' ? 40 : 48} 
          height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Graduation Cap */}
          <path 
            d="M20 8L8 14L20 20L32 14L20 8Z" 
            fill="white" 
            opacity="0.95"
          />
          <path 
            d="M20 20V32C20 32 24 30 24 28V15L20 17.5" 
            fill="white" 
            opacity="0.85"
          />
          
          {/* Ethereum/Ethereum Nodes */}
          <circle cx="12" cy="28" r="2" fill="white" opacity="0.7" />
          <circle cx="20" cy="28" r="2" fill="white" opacity="0.7" />
          <circle cx="28" cy="28" r="2" fill="white" opacity="0.7" />
          
          {/* Connecting Lines */}
          <path 
            d="M12 28L16 26" 
            stroke="white" 
            strokeWidth="1.5" 
            opacity="0.5" 
            strokeLinecap="round"
          />
          <path 
            d="M16 26L18 27" 
            stroke="white" 
            strokeWidth="1.5" 
            opacity="0.5" 
            strokeLinecap="round"
          />
          <path 
            d="M18 27L28 28" 
            stroke="white" 
            strokeWidth="1.5" 
            opacity="0.5" 
            strokeLinecap="round"
          />
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-orange-500/30 blur-md opacity-50"></div>
      </div>

      {/* Brand Name and Subtitle */}
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 dark:text-white tracking-tight ${currentSize.text}`}>
          FundMeUp
        </span>
        {showSubtitle && (
          <span className={`text-gray-500 dark:text-gray-400 tracking-wider uppercase ${currentSize.subtitle} -mt-0.5`}>
            Web3 Scholarships
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo

