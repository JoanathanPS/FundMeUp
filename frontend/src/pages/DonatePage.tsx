import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Users, Sparkles, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import StudentCard from '@/components/StudentCard'
import DonationModal from '@/components/DonationModal'

const DonatePage = () => {
  const [filter, setFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const suggestedStudents = [
    {
      id: '1',
      name: 'Priya Sharma',
      dream: 'Quantum Computing Research',
      field: 'Computer Science',
      country: 'India',
      institution: 'IIT Delhi',
      profileImage: '/api/placeholder/100/100',
      totalFunded: 75000,
      milestonesCompleted: 3,
      totalMilestones: 4,
      isVerified: true,
      isEmailVerified: true,
    },
    {
      id: '2',
      name: 'Rahul Verma',
      dream: 'Sustainable Energy Solutions',
      field: 'Environmental Engineering',
      country: 'India',
      institution: 'NIT Karnataka',
      profileImage: '/api/placeholder/100/100',
      totalFunded: 50000,
      milestonesCompleted: 2,
      totalMilestones: 3,
      isVerified: true,
      isEmailVerified: true,
    },
  ]

  const handleDonate = (student: any) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Make a Donation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Support students achieving their dreams through transparent, verified funding
          </p>
        </motion.div>

        {/* Why Donate Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Direct Impact
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your donations go directly to verified students with AI-authenticated milestones
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              NFT Badges
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive unique NFT badges for every donation as verifiable proof of impact
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See real-time updates on how your donations are helping students achieve milestones
            </p>
          </div>
        </motion.div>

        {/* Suggested Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Suggested Students
            </h2>
            <Link to="/donor" className="text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <StudentCard
                  student={student}
                  showDonateButton={true}
                  onDonate={() => handleDonate(student)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Donation Modal */}
      {showModal && selectedStudent && (
        <DonationModal
          student={selectedStudent}
          onDonate={(amount) => {
            console.log('Donated:', amount)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default DonatePage

