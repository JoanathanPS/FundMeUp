import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAppMode } from '@/context/AppModeContext'

const ModeIndicator = () => {
  const { isDemo } = useAppMode()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = () => {
    if (isDemo) {
      toast('Demo Mode: Using sample data, wallet not required.', {
        icon: 'ℹ️',
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      })
    } else {
      toast('Live Mode: Web3 enabled, wallet connect needed for actions.', {
        icon: '🔗',
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
      })
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 ${
        isDemo
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
      }`}
      title={isDemo ? 'Demo Mode: Sample data only' : 'Live Mode: Web3 enabled'}
    >
      <span>{isDemo ? 'Demo Mode' : 'Live Mode'}</span>
      <Info className="h-3 w-3 opacity-70" />
    </motion.button>
  )
}

export default ModeIndicator

