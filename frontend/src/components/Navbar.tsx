import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Info, Wallet } from 'lucide-react'
import WalletConnectButton from './WalletConnectButton'
import Logo from './Logo'
import { useAppMode } from '@/context/AppModeContext'

interface NavbarProps {
  onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation()
  const { isDemo, toggleMode, mode, isDevMode } = useAppMode()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/student', label: 'Student' },
    { path: '/donor', label: 'Donor' },
    { path: '/feed', label: 'Feed' },
    { path: '/apply', label: 'Apply' },
    { path: '/donate', label: 'Donate' },
    { path: '/impact', label: 'Impact' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/analytics', label: 'Analytics' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-white/10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-hidden">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4">
          {/* Logo - Fixed to left, no hover scale */}
          <Link to="/" className="flex-shrink-0 min-w-0">
            <Logo size="md" showSubtitle={true} />
          </Link>

          {/* Desktop Navigation - Scrollable if needed */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  isActive(item.path)
                    ? 'text-orange-400 bg-orange-500/20 border border-orange-500/30 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connect & Mobile menu - Fixed width, no shrink */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              {/* Demo/Live Mode Toggle Button - Always visible */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toggleMode()
                }}
                className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1.5 text-xs cursor-pointer whitespace-nowrap w-[140px] justify-center flex-shrink-0 ${
                  isDemo
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
                title={isDemo ? 'Demo Mode: Sample data only. Click to switch to Live (Supabase).' : 'Live Mode: Supabase enabled. Click to switch to Demo.'}
              >
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="hidden xl:inline">{isDemo ? 'Demo Mode' : 'Live Mode'}</span>
                <span className="xl:hidden">{isDemo ? 'Demo' : 'Live'}</span>
              </motion.button>

              {/* Wallet Button - Only enabled in Live Mode */}
              <div className="flex-shrink-0">
                {isDemo ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled
                    className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1.5 text-xs cursor-not-allowed opacity-75 whitespace-nowrap"
                    title="Wallet disabled in Demo Mode. Toggle to Live Mode to enable."
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">Connect Wallet</span>
                    <span className="lg:hidden">Connect</span>
                  </motion.button>
                ) : (
                  <WalletConnectButton />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar



