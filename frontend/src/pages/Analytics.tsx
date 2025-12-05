import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Award, 
  Globe,
  BarChart3,
  PieChart,
  MapPin,
  Calendar,
  Filter,
  Download
} from 'lucide-react'

import { leaderboardAPI, feedAPI } from '../services/api'
import ImpactMetrics from '../components/ImpactMetrics'
import Loader from '../components/Loader'
import { useAppMode } from '@/context/AppModeContext'

const Analytics = () => {
  const { isDemo } = useAppMode()
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedType, setSelectedType] = useState('donors')

  // Fetch analytics data
  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics-global'],
    queryFn: async () => {
      const response = await leaderboardAPI.getStats()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['analytics-heatmap'],
    queryFn: async () => {
      const response = await leaderboardAPI.getHeatmap()
      return response.data || []
    },
    staleTime: 10 * 60 * 1000,
  })

  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics-trends', selectedPeriod],
    queryFn: async () => {
      const response = await leaderboardAPI.getTrends(selectedPeriod)
      return response.data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['analytics-leaderboard', selectedType],
    queryFn: async () => {
      const response = await leaderboardAPI.getLeaderboard(selectedType)
      return response.data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  // Mock data for demo
  const mockGlobalStats = {
    totalStudents: 1247,
    verifiedStudents: 892,
    totalFundsRaised: 2450000,
    totalDonors: 156,
    successRate: 87.5,
    avgFundingPerStudent: 1965,
    totalMilestones: 3421,
    verifiedMilestones: 2993
  }

  const mockHeatmapData = [
    {
      country: 'India',
      students: 856,
      verified: 623,
      totalFunds: 1800000,
      institutions: 45,
      coordinates: { lat: 20.5937, lng: 78.9629 }
    },
    {
      country: 'Kenya',
      students: 234,
      verified: 189,
      totalFunds: 450000,
      institutions: 12,
      coordinates: { lat: -0.0236, lng: 37.9062 }
    },
    {
      country: 'Nigeria',
      students: 156,
      verified: 80,
      totalFunds: 200000,
      institutions: 8,
      coordinates: { lat: 9.0765, lng: 7.3986 }
    }
  ]

  const mockTrendsData = [
    { date: '2024-01-01', totalFunded: 45000, transactions: 12 },
    { date: '2024-01-02', totalFunded: 52000, transactions: 15 },
    { date: '2024-01-03', totalFunded: 38000, transactions: 10 },
    { date: '2024-01-04', totalFunded: 61000, transactions: 18 },
    { date: '2024-01-05', totalFunded: 55000, transactions: 16 },
    { date: '2024-01-06', totalFunded: 48000, transactions: 14 },
    { date: '2024-01-07', totalFunded: 67000, transactions: 20 }
  ]

  const mockLeaderboardData = selectedType === 'donors' ? [
    { rank: 1, name: 'Dr. Rajesh Kumar', totalDonated: 150000, studentsSupported: 8, impactScore: 950 },
    { rank: 2, name: 'Tech Ventures India', totalDonated: 200000, studentsSupported: 12, impactScore: 1200 },
    { rank: 3, name: 'Sunita Agarwal', totalDonated: 80000, studentsSupported: 5, impactScore: 620 },
    { rank: 4, name: 'Education Foundation', totalDonated: 120000, studentsSupported: 7, impactScore: 780 },
    { rank: 5, name: 'Anonymous Donor', totalDonated: 65000, studentsSupported: 4, impactScore: 520 }
  ] : [
    { rank: 1, name: 'Priya Sharma', field: 'Computer Science', institution: 'IIT Delhi', milestonesCompleted: 3, totalMilestones: 3, completionRate: 100, fundsRaised: 50000, verified: true },
    { rank: 2, name: 'Anjali Patel', field: 'Biotechnology', institution: 'NIT Karnataka', milestonesCompleted: 2, totalMilestones: 3, completionRate: 67, fundsRaised: 80000, verified: true },
    { rank: 3, name: 'Rahul Verma', field: 'Mechanical Engineering', institution: 'University of Mumbai', milestonesCompleted: 1, totalMilestones: 2, completionRate: 50, fundsRaised: 20000, verified: true },
    { rank: 4, name: 'Karan Singh', field: 'Electrical Engineering', institution: 'BITS Pilani', milestonesCompleted: 0, totalMilestones: 1, completionRate: 0, fundsRaised: 15000, verified: false },
    { rank: 5, name: 'Meera Iyer', field: 'Environmental Science', institution: 'IISc Bangalore', milestonesCompleted: 1, totalMilestones: 2, completionRate: 50, fundsRaised: 35000, verified: true }
  ]

  // In Demo Mode: Always use mockGlobalStats
  // In Live Mode: Use real stats or zeros if no data
  const displayStats = isDemo 
    ? mockGlobalStats
    : (globalStats || {
        totalStudents: 0,
        verifiedStudents: 0,
        totalFundsRaised: 0,
        totalDonors: 0,
        successRate: 0,
        avgFundingPerStudent: 0,
        totalMilestones: 0,
        verifiedMilestones: 0
      })
  const displayHeatmap = heatmapData || mockHeatmapData
  const displayTrends = trendsData || mockTrendsData
  const displayLeaderboard = leaderboardData || mockLeaderboardData

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comprehensive insights into our AI-powered scholarship platform
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <ImpactMetrics data={displayStats} loading={statsLoading} />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Funding Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-orange-600" />
                Funding Trends
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {trendsLoading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                {displayTrends.map((day: { date: string; totalFunded: number; transactions: number }, index: number) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ₹{(day?.totalFunded || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {day?.transactions || 0} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Globe className="h-6 w-6 mr-2 text-blue-600" />
                Geographic Distribution
              </h3>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <MapPin className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {heatmapLoading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                {displayHeatmap.map((country: { country: string; students: number; verified: number; totalFunds: number; institutions: number; coordinates: { lat: number; lng: number } }, index: number) => (
                  <div key={country.country} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {country.country}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {country.institutions} institutions
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Students</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {country.students} ({country.verified} verified)
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Funding</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ₹{(country?.totalFunds || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Award className="h-6 w-6 mr-2 text-purple-600" />
              Leaderboard
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="donors">Top Donors</option>
                <option value="students">Top Students</option>
              </select>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Download className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {leaderboardLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {displayLeaderboard.map((item: { rank: number; name: string; [key: string]: any }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      {selectedType === 'students' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.field} • {item.institution}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {selectedType === 'donors' ? (
                      <>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ₹{((item as any)?.totalDonated || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(item as any).studentsSupported} students
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {(item as any).completionRate}% complete
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{((item as any)?.fundsRaised || 0).toLocaleString('en-IN')} raised
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {displayStats.verifiedStudents}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Verified Students
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-2xl">₹</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ₹{(displayStats?.totalFundsRaised || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Total Funding
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {displayStats.successRate}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Success Rate
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
