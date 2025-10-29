import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Heart, 
  Users, 
  TrendingUp, 
  Award, 
  Shield,
  ArrowRight,
  Star,
  Target,
  Zap,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { feedAPI, leaderboardAPI } from '@/services/api'
import StudentCard from '@/components/StudentCard'
import Loader from '@/components/Loader'

const Home = () => {
  // Fetch global stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['global-stats'],
    queryFn: () => leaderboardAPI.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    onError: (error) => {
      console.error('Error fetching stats:', error)
    },
  })

  const { data: recentActivity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => feedAPI.getRecent(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
    onError: (error) => {
      console.error('Error fetching recent activity:', error)
    },
  })

  // Mock data for demonstration
  const mockStudents = [
    {
      id: '1',
      wallet: '0x1234...5678',
      dream: 'Become a Quantum Computing Researcher',
      field: 'Computer Science',
      year: 3,
      country: 'India',
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
      milestones: [
        { id: '1', title: 'Machine Learning Course', description: 'Complete advanced ML specialization', targetDate: '2024-02-28', status: 'completed' as const },
        { id: '2', title: 'Medical Data Collection', description: 'Gather anonymized patient data', targetDate: '2024-04-10', status: 'completed' as const },
        { id: '3', title: 'Algorithm Development', description: 'Build diagnostic AI model', targetDate: '2024-06-30', status: 'in_progress' as const }
      ],
      verifiedByInstitution: false,
      totalFunded: 3200,
      progress: 67
    }
  ]

  const features = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Smart Scholarships",
      description: "AI-powered matching connects students with the right funding opportunities",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparent Progress",
      description: "Blockchain-verified milestones ensure accountability and trust",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "NFT Achievements",
      description: "Earn unique badges for completing educational milestones",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Impact Tokens",
      description: "Donors earn tokens for supporting student success",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Support students from universities worldwide",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure & Decentralized",
      description: "Built on blockchain for maximum security and transparency",
      color: "from-red-500 to-red-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Fund Dreams,{' '}
                <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Build Futures
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                The world's first Web3-powered scholarship platform where donors fund student dreams 
                and track impact through blockchain-verified milestones, NFTs, and smart contracts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/student"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 group"
              >
                <GraduationCap className="h-6 w-6" />
                <span>I'm a Student</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/donor"
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2 group"
              >
                <Heart className="h-6 w-6" />
                <span>I'm a Donor</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Loader size="lg" />
                  </div>
                ))
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                      {stats?.totalStudents || '1,247'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Students Funded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                      ${stats?.totalFunded || '2.4M'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                      {stats?.completedMilestones || '8,934'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Milestones Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                      {stats?.activeDonors || '3,456'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Donors</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose FundMeUp?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing education funding with cutting-edge Web3 technology, 
              AI-powered matching, and transparent blockchain verification.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover text-center p-8"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Students */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Students
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet some of the amazing students making their dreams come true with FundMeUp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StudentCard
                  student={student}
                  onDonate={(studentId, amount) => {
                    console.log(`Donated $${amount} to student ${studentId}`)
                  }}
                  onViewProfile={(studentId) => {
                    console.log(`View profile for student ${studentId}`)
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/donor"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2 group"
            >
              <span>View All Students</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple, transparent, and secure - here's how FundMeUp connects dreams with funding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Students Apply',
                description: 'Students create profiles, share their dreams, and set educational milestones',
                icon: <GraduationCap className="h-8 w-8" />
              },
              {
                step: '2',
                title: 'AI Matching',
                description: 'Our AI matches students with donors based on interests, goals, and impact potential',
                icon: <Zap className="h-8 w-8" />
              },
              {
                step: '3',
                title: 'Track & Verify',
                description: 'Blockchain technology ensures transparent progress tracking and milestone verification',
                icon: <Shield className="h-8 w-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of donors and students building the future of education together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donor"
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <Heart className="h-5 w-5" />
                <span>Start Donating</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/student"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Apply as Student</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
