import React from 'react'
import { GraduationCap } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'h-6 w-6', text: 'text-lg', subtitle: 'text-xs', gap: 'gap-2' },
    md: { icon: 'h-7 w-7', text: 'text-xl', subtitle: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 'h-8 w-8', text: 'text-2xl', subtitle: 'text-sm', gap: 'gap-3' }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Logo Icon */}
      <div className="flex-shrink-0">
        <GraduationCap className={`${currentSize.icon} text-orange-500`} />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col leading-tight">
        <span className={`font-semibold text-white ${currentSize.text} tracking-tight`}>
          FundMeUp
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-[0.16em] text-slate-400 uppercase">
            WEB3 SCHOLARSHIPS
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo

