import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Activity, 
  Heart, 
  Award, 
  Upload, 
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { feedAPI } from '@/services/api'
import Loader from '@/components/Loader'
import { toast } from 'react-hot-toast'

const ImpactFeed = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [liveUpdates, setLiveUpdates] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  // Auto-refresh every 15 seconds when live updates are enabled
  useEffect(() => {
    if (!liveUpdates) return

    const interval = setInterval(() => {
      setUpdateCount(prev => prev + 1)
      toast.success('🔄 Feed updated!')
    }, 15000)

    return () => clearInterval(interval)
  }, [liveUpdates])

  const toggleLiveUpdates = () => {
    setLiveUpdates(prev => {
      const newValue = !prev
      toast.success(newValue ? '✅ Live updates enabled' : '⏸️ Live updates paused')
      return newValue
    })
  }

  // Mock data for demonstration
  const mockFeedData = [
    {
      id: '1',
      type: 'donation',
      timestamp: '2024-01-15T10:30:00Z',
      student: {
        name: 'Sarah Chen',
        dream: 'Become a Quantum Computing Researcher',
        field: 'Computer Science',
        country: 'India',
        institution: 'IIT Delhi'
      },
      donor: {
        name: 'Alex Johnson',
        wallet: '0x1234...5678'
      },
      amount: 500,
      message: 'Keep up the amazing work! Your research will change the world.',
      verified: true
    },
    {
      id: '2',
      type: 'milestone',
      timestamp: '2024-01-14T15:45:00Z',
      student: {
        name: 'Ahmed Hassan',
        dream: 'Build Sustainable Energy Solutions',
        field: 'Environmental Engineering',
        country: 'Kenya',
        institution: 'University of Nairobi'
      },
      milestone: {
        title: 'Solar Panel Design Project',
        description: 'Successfully completed prototype with 25% efficiency improvement',
        status: 'verified'
      },
      nftBadge: {
        name: 'Solar Innovator',
        rarity: 'rare'
      },
      verified: true
    },
    {
      id: '3',
      type: 'scholarship',
      timestamp: '2024-01-13T09:20:00Z',
      student: {
        name: 'Maria Rodriguez',
        dream: 'Develop AI for Medical Diagnosis',
        field: 'Biomedical Engineering',
        country: 'Brazil',
        institution: 'USP'
      },
      scholarship: {
        amount: 2000,
        status: 'active',
        donors: 3
      },
      verified: true
    },
    {
      id: '4',
      type: 'encouragement',
      timestamp: '2024-01-12T14:15:00Z',
      student: {
        name: 'David Kim',
        dream: 'Create Educational Technology Platform',
        field: 'Computer Science',
        country: 'Nigeria',
        institution: 'University of Lagos'
      },
      donor: {
        name: 'Tech Philanthropist',
        wallet: '0x9876...5432'
      },
      message: 'Your platform will democratize education across Africa. Keep building!',
      verified: true
    },
    {
      id: '5',
      type: 'milestone',
      timestamp: '2024-01-11T11:30:00Z',
      student: {
        name: 'Priya Patel',
        dream: 'Advance Space Technology Research',
        field: 'Aerospace Engineering',
        country: 'India',
        institution: 'ISRO'
      },
      milestone: {
        title: 'Advanced Mathematics Course',
        description: 'Completed with distinction - 98% average across all modules',
        status: 'verified'
      },
      nftBadge: {
        name: 'Math Master',
        rarity: 'epic'
      },
      verified: true
    },
    {
      id: '6',
      type: 'donation',
      timestamp: '2024-01-10T16:00:00Z',
      student: {
        name: 'Carlos Mendez',
        dream: 'Develop Climate Change Solutions',
        field: 'Environmental Science',
        country: 'Mexico',
        institution: 'UNAM'
      },
      donor: {
        name: 'Climate Champion',
        wallet: '0x4567...8901'
      },
      amount: 750,
      message: 'Your work on climate adaptation is crucial for our future.',
      verified: true
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'milestone':
        return <Award className="h-5 w-5 text-yellow-500" />
      case 'scholarship':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'encouragement':
        return <Users className="h-5 w-5 text-blue-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'donation':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'milestone':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'scholarship':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'encouragement':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    }
  }

  const filteredData = mockFeedData.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = searchTerm === '' || 
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.dream.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.field.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Impact Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time updates on student progress, donations, and achievements
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="btn-outline flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button 
                onClick={toggleLiveUpdates}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  liveUpdates 
                    ? 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold' 
                    : 'btn-primary'
                }`}
              >
                <Activity className={`h-4 w-4 ${liveUpdates ? 'animate-pulse' : ''}`} />
                <span>{liveUpdates ? 'Live' : 'Live Updates'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'donation', 'milestone', 'scholarship', 'encouragement'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {filteredData.length === 0 ? (
            <div className="card text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredData.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card border-l-4 ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.student.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                        {activity.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span className="font-medium">{activity.student.dream}</span> • {activity.student.field} • {activity.student.institution}
                    </p>

                    {activity.type === 'donation' && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">
                            New Donation
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            ₹{activity.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          From {activity.donor?.name} ({activity.donor?.wallet})
                        </p>
                        {activity.message && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2 italic">
                            "{activity.message}"
                          </p>
                        )}
                      </div>
                    )}

                    {activity.type === 'milestone' && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Milestone Completed
                          </span>
                          <span className="text-sm text-yellow-600 dark:text-yellow-400">
                            {activity.milestone?.status === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          {activity.milestone?.title}
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                          {activity.milestone?.description}
                        </p>
                        {activity.nftBadge && (
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Earned: {activity.nftBadge.name} ({activity.nftBadge.rarity})
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {activity.type === 'scholarship' && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Scholarship Created
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{activity.scholarship?.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {activity.scholarship?.donors} donors • {activity.scholarship?.status}
                        </p>
                      </div>
                    )}

                    {activity.type === 'encouragement' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Encouragement Message
                          </span>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            From {activity.donor?.name}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                          "{activity.message}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{activity.student.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Load More */}
        {filteredData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="btn-outline text-lg px-8 py-4">
              Load More Activities
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ImpactFeed

