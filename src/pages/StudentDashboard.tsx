import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  Award, 
  Upload, 
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield
} from 'lucide-react'
import { useWeb3 } from '@/services/web3'
import { useQuery } from '@tanstack/react-query'
import { studentAPI, scholarshipAPI, proofAPI } from '@/services/api'
import MilestoneProgressBar from '@/components/MilestoneProgressBar'
import NFTBadgeDisplay from '@/components/NFTBadgeDisplay'
import VerificationStatus from '@/components/VerificationStatus'
import VerificationBadge from '@/components/VerificationBadge'
import Loader from '@/components/Loader'
import { Link } from 'react-router-dom'

const StudentDashboard = () => {
  const { address, isConnected } = useWeb3()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const mockStudent = {
    id: '1',
    wallet: address || '0x1234...5678',
    dream: 'Become a Quantum Computing Researcher',
    field: 'Computer Science',
    year: 3,
    country: 'India',
    institutionName: 'IIT Delhi',
    verifiedByInstitution: true,
    introVideoCID: 'QmVideo123...',
    totalFunded: 2500,
    milestones: [
      {
        id: '1',
        title: 'Complete Advanced Physics Course',
        description: 'Master quantum mechanics fundamentals and complete all coursework with A+ grade',
        targetDate: '2024-02-15',
        status: 'completed' as const,
        mediaCID: 'QmPhysics123...',
        verifiedAt: '2024-02-20'
      },
      {
        id: '2',
        title: 'Research Paper Publication',
        description: 'Publish findings on quantum algorithms in a peer-reviewed journal',
        targetDate: '2024-04-30',
        status: 'in_progress' as const,
        mediaCID: 'QmResearch456...'
      },
      {
        id: '3',
        title: 'Internship at Tech Giant',
        description: 'Secure and complete summer internship at Google/Microsoft/IBM',
        targetDate: '2024-06-15',
        status: 'pending' as const
      },
      {
        id: '4',
        title: 'Thesis Defense',
        description: 'Successfully defend master\'s thesis on quantum computing applications',
        targetDate: '2024-08-30',
        status: 'pending' as const
      }
    ],
    scholarships: [
      {
        id: '1',
        amount: 1000,
        funded: 1000,
        status: 'active',
        donors: ['0xDonor1...', '0xDonor2...'],
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        amount: 1500,
        funded: 1500,
        status: 'active',
        donors: ['0xDonor3...'],
        createdAt: '2024-02-01'
      }
    ],
    nftBadges: [
      {
        id: '1',
        tokenId: 1,
        name: 'Physics Master',
        description: 'Completed Advanced Physics Course with excellence',
        image: '/api/placeholder/64/64',
        metadata: 'QmMetadata1...',
        mintedAt: '2024-02-20',
        milestoneId: '1',
        rarity: 'rare' as const
      },
      {
        id: '2',
        tokenId: 2,
        name: 'Research Scholar',
        description: 'Published first research paper',
        image: '/api/placeholder/64/64',
        metadata: 'QmMetadata2...',
        mintedAt: '2024-03-15',
        milestoneId: '2',
        rarity: 'epic' as const
      }
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
    { id: 'milestones', label: 'Milestones', icon: <Award className="h-4 w-4" /> },
    { id: 'scholarships', label: 'Scholarships', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'badges', label: 'NFT Badges', icon: <Award className="h-4 w-4" /> }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <GraduationCap className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please connect your wallet to access your student dashboard
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This will allow you to view your progress, manage scholarships, and track your achievements
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Welcome back, Student!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress and manage your educational journey
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/student/upload"
                className="btn-primary flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Submit Proof</span>
              </Link>
              <Link
                to="/student/verification"
                className="btn-outline flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Verify Email</span>
              </Link>
              <button className="btn-outline flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Student Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockStudent.dream}
                  </h2>
                  <VerificationBadge 
                    isVerified={mockStudent.isEmailVerified || false}
                    verificationType="email"
                    className="text-xs"
                  />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{mockStudent.institutionName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{mockStudent.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Year {mockStudent.year}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ₹{mockStudent.totalFunded.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Funded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mockStudent.milestones.filter(m => m.status === 'completed' || m.status === 'verified').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mockStudent.nftBadges.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Badges</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Verification Status */}
              <VerificationStatus 
                wallet={address || '0x1234...5678'} 
                onVerificationComplete={(status) => {
                  console.log('Verification completed:', status)
                }}
              />

              <div className="grid md:grid-cols-2 gap-8">
                {/* Progress Overview */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Progress Overview
                  </h3>
                  <MilestoneProgressBar
                    milestones={mockStudent.milestones}
                    showDetails={false}
                  />
                </div>

              {/* Recent Activity */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Milestone completed', date: '2 days ago', type: 'success' },
                    { action: 'New donation received', date: '1 week ago', type: 'info' },
                    { action: 'NFT badge minted', date: '2 weeks ago', type: 'award' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Milestones
                </h3>
                <button className="btn-outline flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Milestone</span>
                </button>
              </div>
              <MilestoneProgressBar
                milestones={mockStudent.milestones}
                showDetails={true}
                onMilestoneClick={(milestone) => {
                  console.log('Milestone clicked:', milestone)
                }}
              />
            </div>
          )}

          {activeTab === 'scholarships' && (
            <div className="space-y-6">
              {mockStudent.scholarships.map((scholarship, index) => (
                <div key={scholarship.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Scholarship #{scholarship.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created on {new Date(scholarship.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{scholarship.funded.toLocaleString("en-IN")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        of ₹{scholarship.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(scholarship.funded / scholarship.amount) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>{scholarship.donors.length} donors</span>
                      <span>{Math.round((scholarship.funded / scholarship.amount) * 100)}% funded</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your NFT Badges
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {mockStudent.nftBadges.length} badges earned
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStudent.nftBadges.map((badge) => (
                  <NFTBadgeDisplay
                    key={badge.id}
                    badge={badge}
                    showDetails={true}
                    onClick={(badge) => {
                      console.log('Badge clicked:', badge)
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default StudentDashboard