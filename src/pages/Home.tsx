import React from 'react'
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
  Sparkles,
  Brain,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { feedAPI, leaderboardAPI } from '@/services/api'
import StudentCard from '@/components/StudentCard'
import WalletConnectButton from '@/components/WalletConnectButton'
import Loader from '@/components/Loader'
import ImpactMetrics from '@/components/ImpactMetrics'

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

  // Mock data for demo (fallback when API fails)
  const mockStats = {
    totalStudents: 1247,
    verifiedStudents: 892,
    totalFundsRaised: 2450000, // INR
    totalDonors: 156,
    successRate: 87.5,
    avgFundingPerStudent: 1965,
    totalMilestones: 3421,
    verifiedMilestones: 2993
  }

  const displayStats = stats || mockStats

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
      country: 'India',
      milestones: [
        { id: '1', title: 'Machine Learning Certification', description: 'Complete advanced ML course', targetDate: '2024-01-15', status: 'completed' as const },
        { id: '2', title: 'Medical Dataset Collection', description: 'Gather diagnostic imaging data', targetDate: '2024-03-01', status: 'completed' as const },
        { id: '3', title: 'Clinical Trial Phase', description: 'Test AI model in hospital setting', targetDate: '2024-06-30', status: 'pending' as const }
      ],
      verifiedByInstitution: true,
      institutionName: 'AIIMS Delhi',
      totalFunded: 3200,
      progress: 67
    }
  ]

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* AI-Powered Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Brain className="h-4 w-4" />
              <span>AI-Powered Verification</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              FundMeUp
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              AI-Powered Web3 Scholarships for Transparent Education Funding
            </p>
            <p className="text-lg text-orange-300 mb-8 max-w-2xl mx-auto font-medium">
              "Funding Futures, One Verified Milestone at a Time"
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Funding Students
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900"
              >
                Apply for Scholarship
              </motion.button>
            </div>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {displayStats.totalStudents.toLocaleString()}
              </div>
              <div className="text-orange-300">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                ₹{displayStats.totalFundsRaised.toLocaleString('en-IN')}
              </div>
              <div className="text-orange-300">Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {displayStats.successRate}%
              </div>
              <div className="text-orange-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {displayStats.totalDonors}
              </div>
              <div className="text-orange-300">Active Donors</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why FundMeUp Exists Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why FundMeUp Exists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Education Funding Crisis
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p className="text-lg">
                    <strong>₹50,000 crores</strong> in scholarships are distributed annually in India, yet <strong>40%</strong> of students never receive the funding they deserve.
                  </p>
                  <p>
                    Traditional scholarship systems suffer from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Lack of transparency in fund distribution</li>
                    <li>High administrative overhead (20-30% fees)</li>
                    <li>No accountability for fund utilization</li>
                    <li>Manual verification prone to errors and bias</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">40%</div>
                  <div className="text-gray-600 dark:text-gray-400">Students miss out on funding</div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span>Transparency</span>
                    <span className="text-red-500">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accountability</span>
                    <span className="text-red-500">Poor</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification</span>
                    <span className="text-red-500">Manual</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Solution
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              FundMeUp combines AI intelligence, regional data, and blockchain transparency to revolutionize education funding
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  AI-Powered Verification
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analyzes student documents with 95% accuracy, providing detailed reasoning and confidence scores for every verification.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Regional Intelligence
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Integrated with local government datasets to verify student eligibility and institutional credibility automatically.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Blockchain Transparency
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every transaction is recorded on-chain, ensuring complete transparency and accountability for all stakeholders.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Three simple steps to transparent, AI-verified education funding
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                AI Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Students submit proof of milestones. Our AI analyzes documents for authenticity and provides detailed reasoning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Blockchain Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All transactions are recorded on-chain. Donors can track exactly where their funds go with complete transparency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Milestone-Based Funding
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Funds are released only after verified milestone completion, ensuring accountability and proper fund utilization.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Live Platform Impact
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real-time statistics from our AI-powered scholarship platform
            </p>
          </motion.div>

          <ImpactMetrics data={displayStats} loading={statsLoading} />
        </div>
      </section>

      {/* Student Success Stories Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real students achieving their dreams through transparent, AI-verified funding
            </p>
          </motion.div>

          {/* Success Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">PS</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Priya Sharma</h3>
                  <p className="text-gray-600 dark:text-gray-400">Computer Science, IIT Delhi</p>
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                "FundMeUp's AI verification made the process so transparent. I could see exactly why my proof was approved, 
                and the regional data integration gave me confidence that my institution was properly verified. 
                I received ₹50,000 in funding within 24 hours of milestone completion."
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="font-semibold">Milestones Completed: 3/3</div>
                  <div>AI Confidence: 95%</div>
                </div>
                <div className="text-2xl font-bold text-green-600">₹50,000</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Anjali Patel</h3>
                  <p className="text-gray-600 dark:text-gray-400">Biotechnology, NIT Karnataka</p>
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                "The milestone-based funding system kept me accountable and motivated. Each verification was detailed 
                and fair. The AI even provided feedback on how to improve my documentation. 
                I'm now working on my dream research project thanks to this platform."
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="font-semibold">Milestones Completed: 2/3</div>
                  <div>AI Confidence: 88%</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">₹80,000</div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StudentCard student={student} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/student"
              className="btn-primary text-lg px-8 py-4"
            >
              View All Students
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join our community of donors and help students achieve their dreams through transparent, AI-verified funding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donor"
                className="btn-primary bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Start Donating
                <Heart className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/student"
                className="btn-outline text-white border-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4"
              >
                Apply for Scholarship
                <GraduationCap className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
