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
  Coins,
  CheckCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { feedAPI, leaderboardAPI } from '@/services/api'
import StudentCard from '@/components/StudentCard'
import WalletConnectButton from '@/components/WalletConnectButton'
import Loader from '@/components/Loader'
import ImpactMetrics from '@/components/ImpactMetrics'
import ETHPriceChart from '@/components/ETHPriceChart'
import Button from '@/components/Button'
import { useScholarships } from '@/hooks/useScholarships'
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner'
import EmptyState from '@/components/EmptyState'
import { useAppMode } from '@/context/AppModeContext'

const Home = () => {
  const { isDemo } = useAppMode()
  
  // Fetch scholarships using the new hook
  const { data: scholarships, loading: scholarshipsLoading, error: scholarshipsError, reload: reloadScholarships } = useScholarships({ page: 1, limit: 6 })

  // Fetch global stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['global-stats'],
    queryFn: () => leaderboardAPI.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  const { data: recentActivity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => feedAPI.getRecent(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
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

  // In Demo Mode: Always use mockStats
  // In Live Mode: Use real stats or zeros if no data
  const displayStats = isDemo 
    ? mockStats
    : (stats || {
        totalStudents: 0,
        verifiedStudents: 0,
        totalFundsRaised: 0,
        totalDonors: 0,
        successRate: 0,
        avgFundingPerStudent: 0,
        totalMilestones: 0,
        verifiedMilestones: 0
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

  // Convert scholarships to student format for StudentCard
  // Demo Mode: Use mockStudents
  // Live Mode: Use ONLY scholarships from Supabase (no fallback to mockStudents)
  const displayStudents = isDemo 
    ? mockStudents 
    : (scholarships || []).map(s => ({
        id: s.id || '',
        wallet: s.student_wallet || '',
        dream: s.title || '',
        field: s.field || '',
        year: s.year || 0,
        country: s.country || '',
        milestones: Array.isArray(s.milestones) ? s.milestones : [],
        verifiedByInstitution: s.verified || false,
        institutionName: s.institution_name || '',
        totalFunded: Number(s.raised) || 0,
        progress: s.goal > 0 ? Math.round((Number(s.raised) / Number(s.goal)) * 100) : 0
      }))

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Supabase Status Banner - Show when in Live Mode with errors */}
      {!isDemo && scholarshipsError && (
        <SupabaseStatusBanner 
          error={scholarshipsError}
          healthStatus={typeof scholarshipsError === 'object' && 'ok' in scholarshipsError 
            ? scholarshipsError as any
            : undefined}
          onRetry={reloadScholarships}
        />
      )}
      
      {/* Empty State - Show when Live Mode has no data (but no error) */}
      {!isDemo && !scholarshipsLoading && scholarships.length === 0 && !scholarshipsError && (
        <EmptyState 
          title="No scholarships yet"
          message="Your Supabase database is connected but empty. Add scholarships via Supabase dashboard or API."
          showToggle={true}
          showMigrationCTA={false}
        />
      )}
      
      {/* Hero Section - Modern with depth */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Subtle radial/gradient background for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.08),transparent_50%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {/* Hero Content - Centered vertically */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-5xl"
            >
              {/* AI-Powered Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/90 to-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/10 shadow-lg"
              >
                <Brain className="h-4 w-4" />
                <span>AI-Powered Verification</span>
              </motion.div>

              {/* Large, bold headline with better hierarchy */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                FundMeUp
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-3 text-orange-400 font-semibold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 bg-clip-text text-transparent">
                  – Web3 Scholarships
                </span>
              </h1>
              
              {/* Subheadline with improved line height and medium width */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
                AI-Powered transparent scholarship platform. Support students, verify milestones, and fund education on the blockchain.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-orange-300/90 mb-10 max-w-2xl mx-auto font-medium italic">
                "Funding Futures, One Verified Milestone at a Time"
              </p>
              
              {/* CTA Buttons - Primary emphasized, secondary as ghost/outlined */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/donor" className="w-full sm:w-auto group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-500/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Start Funding Students</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/student" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span>For Students</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Grid - Rounded cards with soft shadows and clear labels */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full mt-8 md:mt-12"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
                {/* Students Helped Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 overflow-hidden relative isolate"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight truncate">
                    {(displayStats?.totalStudents || 0).toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">Students Helped</div>
                </motion.div>
                
                {/* Funds Raised Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 overflow-hidden relative isolate"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                    ₹{((displayStats?.totalFundsRaised || 0) / 100000).toFixed(1)}L
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">Funds Raised</div>
                </motion.div>
                
                {/* Success Rate Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 overflow-hidden relative isolate"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {displayStats?.successRate || 0}%
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">Success Rate</div>
                </motion.div>
                
                {/* Active Donors Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 overflow-hidden relative isolate"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {displayStats?.totalDonors || 0}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">Active Donors</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why FundMeUp Exists Section */}
      <section className="py-16 px-4 bg-gray-900/50 backdrop-blur-sm">
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

      {/* ETH Price Tracker Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <ETHPriceChart />
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

          {/* Scholarships/Students Grid */}
          {scholarshipsLoading ? (
            <div className="flex justify-center py-12">
              <Loader text="Loading scholarships..." />
            </div>
          ) : displayStudents.length === 0 ? (
            <EmptyState
              title="No scholarships yet"
              message={isDemo 
                ? "Switch to Live Mode to fetch data from Supabase, or add data in Supabase dashboard."
                : "Add scholarships in Supabase or switch to Demo Mode to view sample data."
              }
              showToggle={true}
              showMigrationCTA={!isDemo && scholarshipsError && 'status' in scholarshipsError && scholarshipsError.status === 200}
              onRunMigration={() => {
                // This will be handled by SupabaseStatusBanner
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <StudentCard student={student} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 mb-16 flex justify-center">
            <Link
              to="/student"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors duration-200 flex items-center space-x-2"
            >
              <span>View All Students</span>
              <ArrowRight className="h-5 w-5" />
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



