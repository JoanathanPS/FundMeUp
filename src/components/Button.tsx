import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  href?: string
  as?: 'button' | 'a'
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  disabled = false,
  fullWidth = false,
  className = '',
  href,
  as = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg focus:ring-orange-500',
    outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const fullWidthClass = fullWidth ? 'w-full' : ''
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className}`
  
  const [isHovered, setIsHovered] = React.useState(false)
  
  const iconAnimationProps = {
    initial: { x: 0 },
    animate: { x: isHovered && iconPosition === 'right' ? 4 : isHovered && iconPosition === 'left' ? -4 : 0 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
  
  const buttonProps = {
    className: buttonClasses,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick,
    disabled
  }
  
  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <motion.div {...iconAnimationProps}>
          <Icon className="h-5 w-5" />
        </motion.div>
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <motion.div {...iconAnimationProps}>
          <Icon className="h-5 w-5" />
        </motion.div>
      )}
    </>
  )
  
  if (as === 'a' && href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...buttonProps}
      >
        {content}
      </motion.a>
    )
  }
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      {...buttonProps}
    >
      {content}
    </motion.button>
  )
}

export default Button

