import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Award, 
  Target,
  CheckCircle,
  Globe
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red'
  format?: 'number' | 'currency' | 'percentage'
  description?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue',
  format = 'number',
  description 
}) => {
  const getColorClasses = (color: string) => {
    const colors = {
      green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      red: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const formatValue = (val: string | number, format: string) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(val)
      case 'percentage':
        return `${val}%`
      default:
        return new Intl.NumberFormat('en-IN').format(val)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatValue(value, format)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {title}
        </div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface ImpactMetricsProps {
  data: {
    totalStudents: number
    verifiedStudents: number
    totalFundsRaised: number
    totalDonors: number
    successRate: number
    avgFundingPerStudent: number
    totalMilestones: number
    verifiedMilestones: number
  }
  loading?: boolean
}

const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded mb-2" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={data.totalStudents}
          icon={<Users className="h-6 w-6" />}
          color="blue"
          change={12}
          description="Students registered"
        />
        
        <MetricCard
          title="Verified Students"
          value={data.verifiedStudents}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
          change={8}
          description="AI verified profiles"
        />
        
        <MetricCard
          title="Total Funding"
          value={data.totalFundsRaised}
          icon={<DollarSign className="h-6 w-6" />}
          color="orange"
          format="currency"
          change={25}
          description="Raised in INR"
        />
        
        <MetricCard
          title="Active Donors"
          value={data.totalDonors}
          icon={<Award className="h-6 w-6" />}
          color="purple"
          change={15}
          description="Supporting students"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Success Rate"
          value={data.successRate}
          icon={<Target className="h-6 w-6" />}
          color="green"
          format="percentage"
          change={5}
          description="Milestone completion"
        />
        
        <MetricCard
          title="Avg Funding"
          value={data.avgFundingPerStudent}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
          format="currency"
          change={-2}
          description="Per student"
        />
        
        <MetricCard
          title="Total Milestones"
          value={data.totalMilestones}
          icon={<Target className="h-6 w-6" />}
          color="purple"
          change={18}
          description="All milestones"
        />
        
        <MetricCard
          title="Verified Milestones"
          value={data.verifiedMilestones}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
          change={22}
          description="AI verified"
        />
      </div>

      {/* Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Global Impact
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.verifiedStudents}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Students Helped
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{data.totalFundsRaised.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Funds Distributed
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.successRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Success Rate
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ImpactMetrics
