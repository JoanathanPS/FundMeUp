import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Users, 
  DollarSign,
  Star,
  Crown,
  Medal,
  Target,
  Calendar,
  MapPin,
  Building
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { leaderboardAPI } from '@/services/api'
import Loader from '@/components/Loader'

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('donors')
  const [timeframe, setTimeframe] = useState('all')

  // Mock data for demonstration
  const mockDonors = [
    {
      id: '1',
      wallet: '0x1234...5678',
      name: 'Alex Johnson',
      totalDonated: 15000,
      studentsSupported: 12,
      impactScore: 95,
      rank: 1,
      badges: ['Top Supporter', 'Climate Champion', 'Education Hero'],
      country: 'United States',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      wallet: '0x2345...6789',
      name: 'Sarah Chen',
      totalDonated: 12000,
      studentsSupported: 8,
      impactScore: 88,
      rank: 2,
      badges: ['Tech Philanthropist', 'Research Supporter'],
      country: 'Singapore',
      joinDate: '2023-02-20'
    },
    {
      id: '3',
      wallet: '0x3456...7890',
      name: 'Ahmed Hassan',
      totalDonated: 8500,
      studentsSupported: 6,
      impactScore: 82,
      rank: 3,
      badges: ['Global Impact', 'STEM Advocate'],
      country: 'UAE',
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      wallet: '0x4567...8901',
      name: 'Maria Rodriguez',
      totalDonated: 7200,
      studentsSupported: 5,
      impactScore: 78,
      rank: 4,
      badges: ['Education Champion'],
      country: 'Mexico',
      joinDate: '2023-04-05'
    },
    {
      id: '5',
      wallet: '0x5678...9012',
      name: 'David Kim',
      totalDonated: 6800,
      studentsSupported: 7,
      impactScore: 75,
      rank: 5,
      badges: ['Innovation Supporter'],
      country: 'South Korea',
      joinDate: '2023-05-12'
    }
  ]

  const mockStudents = [
    {
      id: '1',
      wallet: '0x1111...2222',
      name: 'Priya Patel',
      dream: 'Become a Quantum Computing Researcher',
      field: 'Computer Science',
      institution: 'IIT Delhi',
      country: 'India',
      totalFunded: 5000,
      milestonesCompleted: 8,
      impactScore: 92,
      rank: 1,
      badges: ['Research Excellence', 'Innovation Leader'],
      joinDate: '2023-01-20'
    },
    {
      id: '2',
      wallet: '0x2222...3333',
      name: 'Carlos Mendez',
      dream: 'Develop Climate Change Solutions',
      field: 'Environmental Science',
      institution: 'UNAM',
      country: 'Mexico',
      totalFunded: 4200,
      milestonesCompleted: 6,
      impactScore: 87,
      rank: 2,
      badges: ['Climate Champion', 'Community Impact'],
      joinDate: '2023-02-15'
    },
    {
      id: '3',
      wallet: '0x3333...4444',
      name: 'Fatima Al-Zahra',
      dream: 'Build Sustainable Energy Solutions',
      field: 'Environmental Engineering',
      institution: 'University of Nairobi',
      country: 'Kenya',
      totalFunded: 3800,
      milestonesCompleted: 5,
      impactScore: 83,
      rank: 3,
      badges: ['Sustainability Leader'],
      joinDate: '2023-03-01'
    },
    {
      id: '4',
      wallet: '0x4444...5555',
      name: 'James Wilson',
      dream: 'Develop AI for Medical Diagnosis',
      field: 'Biomedical Engineering',
      institution: 'MIT',
      country: 'United States',
      totalFunded: 3500,
      milestonesCompleted: 4,
      impactScore: 79,
      rank: 4,
      badges: ['Medical Innovation'],
      joinDate: '2023-03-20'
    },
    {
      id: '5',
      wallet: '0x5555...6666',
      name: 'Aisha Okafor',
      dream: 'Create Educational Technology Platform',
      field: 'Computer Science',
      institution: 'University of Lagos',
      country: 'Nigeria',
      totalFunded: 3200,
      milestonesCompleted: 6,
      impactScore: 76,
      rank: 5,
      badges: ['EdTech Pioneer'],
      joinDate: '2023-04-10'
    }
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600'
    return 'bg-gray-200 dark:bg-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Leaderboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Celebrate the top donors and most successful students making a difference in education
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('donors')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'donors'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Top Donors
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'students'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Top Students
              </button>
            </div>
          </div>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {['all', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {period === 'all' ? 'All Time' : period === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'donors' ? (
            <div className="space-y-4">
              {mockDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getRankColor(donor.rank)}`}>
                        {getRankIcon(donor.rank)}
                      </div>
                    </div>

                    {/* Donor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {donor.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-lg font-bold text-orange-600">
                            {donor.impactScore}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{donor.country}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(donor.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            ${donor.totalDonated.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Donated</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {donor.studentsSupported}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Students Supported</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {donor.badges.length}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Badges Earned</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {donor.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="badge-primary text-xs"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mockStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getRankColor(student.rank)}`}>
                        {getRankIcon(student.rank)}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {student.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-green-500" />
                          <span className="text-lg font-bold text-green-600">
                            {student.impactScore}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-medium">{student.dream}</span>
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{student.institution}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{student.country}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(student.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            ${student.totalFunded.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Funded</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {student.milestonesCompleted}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Milestones Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {student.badges.length}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Badges Earned</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {student.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="badge-success text-xs"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'donors' ? mockDonors.length : mockStudents.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {activeTab === 'donors' ? 'Active Donors' : 'Active Students'}
            </div>
          </div>
          <div className="card text-center">
            <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ${activeTab === 'donors' 
                ? mockDonors.reduce((sum, d) => sum + d.totalDonated, 0).toLocaleString()
                : mockStudents.reduce((sum, s) => sum + s.totalFunded, 0).toLocaleString()
              }
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {activeTab === 'donors' ? 'Total Donated' : 'Total Funded'}
            </div>
          </div>
          <div className="card text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'donors' 
                ? mockDonors.reduce((sum, d) => sum + d.studentsSupported, 0)
                : mockStudents.reduce((sum, s) => sum + s.milestonesCompleted, 0)
              }
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {activeTab === 'donors' ? 'Students Supported' : 'Milestones Completed'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard

