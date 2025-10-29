import React from 'react'
import { motion } from 'framer-motion'
import { Award, Heart, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImpactFeed from './ImpactFeed'

const ImpactPage = () => {
  const stats = [
    { label: 'Total Students', value: '150', icon: Users, color: 'blue' },
    { label: 'Funds Raised', value: '₹12.5M', icon: TrendingUp, color: 'green' },
    { label: 'Success Rate', value: '92%', icon: Award, color: 'orange' },
    { label: 'Donations Made', value: '1,250+', icon: Heart, color: 'red' },
  ]

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-orange-500 to-blue-600 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Real Impact, Real Stories
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            See how transparent, AI-verified funding is changing lives
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Feed */}
        <ImpactFeed />
      </div>
    </div>
  )
}

export default ImpactPage

