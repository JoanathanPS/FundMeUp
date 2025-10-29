import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Award,
  MapPin,
  Calendar,
  Building,
  Star,
  Eye,
  DollarSign,
  Target,
  Globe
} from 'lucide-react'
import { useWeb3 } from '@/services/web3'
import { useQuery } from '@tanstack/react-query'
import { studentAPI, scholarshipAPI } from '@/services/api'
import StudentCard from '@/components/StudentCard'
import Loader from '@/components/Loader'

const DonorDashboard = () => {
  const { address, isConnected } = useWeb3()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedField, setSelectedField] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Mock data for demonstration
  const mockStudents = [
    {
      id: '1',
      wallet: '0x1234...5678',
      dream: 'Become a Quantum Computing Researcher',
      field: 'Computer Science',
      year: 3,
      country: 'India',
      introVideoCID: 'QmVideo123...',
      milestones: [
        { id: '1', title: 'Complete Advanced Physics Course', description: 'Master quantum mechanics fundamentals', targetDate: '2024-02-15', status: 'completed' as const },
        { id: '2', title: 'Research Paper Publication', description: 'Publish findings on quantum algorithms', targetDate: '2024-04-30', status: 'in_progress' as const },
        { id: '3', title: 'Internship at Tech Giant', description: 'Gain industry experience', targetDate: '2024-06-15', status: 'pending' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'IIT Delhi',
      totalFunded: 2500,
      progress: 33
    },
    {
      id: '2',
      wallet: '0x2345...6789',
      dream: 'Build Sustainable Energy Solutions',
      field: 'Environmental Engineering',
      year: 2,
      country: 'Kenya',
      introVideoCID: 'QmVideo456...',
      milestones: [
        { id: '1', title: 'Solar Panel Design Project', description: 'Create efficient solar panel prototype', targetDate: '2024-01-30', status: 'completed' as const },
        { id: '2', title: 'Community Impact Study', description: 'Analyze local energy needs', targetDate: '2024-03-15', status: 'completed' as const },
        { id: '3', title: 'Patent Application', description: 'File patent for innovative design', targetDate: '2024-05-20', status: 'in_progress' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'University of Nairobi',
      totalFunded: 1800,
      progress: 67
    },
    {
      id: '3',
      wallet: '0x3456...7890',
      dream: 'Develop AI for Medical Diagnosis',
      field: 'Biomedical Engineering',
      year: 4,
      country: 'Brazil',
      introVideoCID: 'QmVideo789...',
      milestones: [
        { id: '1', title: 'Machine Learning Course', description: 'Complete advanced ML specialization', targetDate: '2024-02-28', status: 'completed' as const },
        { id: '2', title: 'Medical Data Collection', description: 'Gather anonymized patient data', targetDate: '2024-04-10', status: 'completed' as const },
        { id: '3', title: 'Algorithm Development', description: 'Build diagnostic AI model', targetDate: '2024-06-30', status: 'in_progress' as const }
      ],
      verifiedByInstitution: false,
      totalFunded: 3200,
      progress: 67
    },
    {
      id: '4',
      wallet: '0x4567...8901',
      dream: 'Create Educational Technology Platform',
      field: 'Computer Science',
      year: 1,
      country: 'Nigeria',
      introVideoCID: 'QmVideo101...',
      milestones: [
        { id: '1', title: 'Learn Full-Stack Development', description: 'Master React, Node.js, and databases', targetDate: '2024-03-15', status: 'in_progress' as const },
        { id: '2', title: 'Build MVP Platform', description: 'Create working prototype', targetDate: '2024-06-30', status: 'pending' as const },
        { id: '3', title: 'User Testing', description: 'Test with local schools', targetDate: '2024-09-15', status: 'pending' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'University of Lagos',
      totalFunded: 500,
      progress: 17
    },
    {
      id: '5',
      wallet: '0x5678...9012',
      dream: 'Advance Space Technology Research',
      field: 'Aerospace Engineering',
      year: 2,
      country: 'Mexico',
      introVideoCID: 'QmVideo202...',
      milestones: [
        { id: '1', title: 'Advanced Mathematics', description: 'Complete calculus and physics courses', targetDate: '2024-02-28', status: 'completed' as const },
        { id: '2', title: 'Research Internship', description: 'Work with space agency', targetDate: '2024-05-15', status: 'in_progress' as const },
        { id: '3', title: 'Thesis Proposal', description: 'Submit research proposal', targetDate: '2024-08-30', status: 'pending' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'UNAM',
      totalFunded: 1200,
      progress: 33
    },
    {
      id: '6',
      wallet: '0x6789...0123',
      dream: 'Develop Climate Change Solutions',
      field: 'Environmental Science',
      year: 3,
      country: 'Bangladesh',
      introVideoCID: 'QmVideo303...',
      milestones: [
        { id: '1', title: 'Climate Data Analysis', description: 'Study local climate patterns', targetDate: '2024-01-31', status: 'completed' as const },
        { id: '2', title: 'Solution Development', description: 'Create adaptation strategies', targetDate: '2024-04-30', status: 'in_progress' as const },
        { id: '3', title: 'Community Implementation', description: 'Deploy solutions locally', targetDate: '2024-07-15', status: 'pending' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'University of Dhaka',
      totalFunded: 900,
      progress: 33
    }
  ]

  const fields = ['all', 'Computer Science', 'Environmental Engineering', 'Biomedical Engineering', 'Aerospace Engineering', 'Environmental Science']
  const countries = ['all', 'India', 'Kenya', 'Brazil', 'Nigeria', 'Mexico', 'Bangladesh']

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.dream.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === 'all' || student.field === selectedField
    const matchesCountry = selectedCountry === 'all' || student.country === selectedCountry
    
    return matchesSearch && matchesField && matchesCountry
  })

  const handleDonate = (studentId: string, amount: number) => {
    console.log(`Donated ₹${amount.toLocaleString("en-IN")} to student ${studentId}`)
    // Note: Actual saving is handled by DonationModal component
  }

  const handleViewProfile = (studentId: string) => {
    console.log(`View profile for student ${studentId}`)
    // Here you would navigate to student profile or open modal
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <Heart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please connect your wallet to start funding student dreams
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This will allow you to browse students, make donations, and track your impact
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
                Find Students to Support
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover amazing students and help them achieve their dreams
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/my-donations" className="btn-primary flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Recent Donations</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {mockStudents.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Students Available</div>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {new Set(mockStudents.map(s => s.country)).size}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Countries</div>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {mockStudents.filter(s => s.verifiedByInstitution).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Verified</div>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              ${mockStudents.reduce((sum, s) => sum + s.totalFunded, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Raised</div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by dream, field, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="input"
              >
                {fields.map(field => (
                  <option key={field} value={field}>
                    {field === 'all' ? 'All Fields' : field}
                  </option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="input"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_funded">Most Funded</option>
                <option value="least_funded">Least Funded</option>
                <option value="highest_progress">Highest Progress</option>
                <option value="lowest_progress">Lowest Progress</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Students Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredStudents.length === 0 ? (
            <div className="card text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedField('all')
                  setSelectedCountry('all')
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StudentCard
                    student={student}
                    onDonate={handleDonate}
                    onViewProfile={handleViewProfile}
                    showDonateButton={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Load More */}
        {filteredStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="btn-outline text-lg px-8 py-4">
              Load More Students
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DonorDashboard
