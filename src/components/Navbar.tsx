import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import WalletConnectButton from './WalletConnectButton'
import Logo from './Logo'

interface NavbarProps {
  onMenuClick: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation()

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
      className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="md" showSubtitle={true} />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'text-orange-500 bg-gray-800'
                    : 'text-gray-300 hover:text-orange-400 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connect & Mobile menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WalletConnectButton />
            </div>
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-300 hover:text-orange-400 hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar



