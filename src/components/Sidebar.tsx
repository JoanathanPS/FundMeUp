import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  if (!isOpen) return null

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/student', label: 'Student' },
    { path: '/donor', label: 'Donor' },
    { path: '/feed', label: 'Feed' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-orange-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 mb-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar