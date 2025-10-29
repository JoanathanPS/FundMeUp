import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  User,
  Clock
} from 'lucide-react'
import { donationStorage, type Donation } from '@/utils/donationStorage'

const MyDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([])
  
  useEffect(() => {
    // Load donations from storage
    const allDonations = donationStorage.getAllDonations()
    setDonations(allDonations)
    
    // Also listen for storage changes
    const handleStorageChange = () => {
      setDonations(donationStorage.getAllDonations())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // Re-check on mount and every second to catch local changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDonations(donationStorage.getAllDonations())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const totalDonated = donationStorage.getTotalDonated()
  const donationCount = donationStorage.getDonationCount()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/donor" className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Browse Students</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            My Donations
          </h1>
          <p className="text-gray-300">
            Track all your contributions and impact
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-white">
                ₹{totalDonated.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Total Donated</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-3xl font-bold text-white">
                {donationCount}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Total Donations</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <User className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-white">
                {new Set(donations.map(d => d.studentId)).size}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Students Helped</p>
          </div>
        </motion.div>

        {/* Donations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {donations.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Donations Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start supporting students by making your first donation!
              </p>
              <Link to="/donor" className="btn-primary inline-flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                <span>Browse Students</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation, index: number) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {donation.studentName}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {donation.milestone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        ₹{donation.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(donation.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MyDonations

