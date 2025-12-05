import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  GraduationCap, 
  FileText, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Loader2,
  Save
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useWeb3 } from '@/services/web3'
import { useAppMode } from '@/context/AppModeContext'
import { Info } from 'lucide-react'
import { blockchainSimulator } from '@/services/blockchainSimulator'
import { scholarshipStorage } from '@/utils/scholarshipStorage'
import { scholarshipAPI } from '@/services/api'

const ApplyPage = () => {
  const navigate = useNavigate()
  const { isConnected, address } = useWeb3()
  const { isDemo } = useAppMode()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    field: '',
    targetAmount: '',
    milestones: [] as { title: string; deadline: string; description: string }[]
  })
  const [isDraft, setIsDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  const steps = [
    { id: 1, label: 'Basic Info', icon: FileText },
    { id: 2, label: 'Scholarship Details', icon: Target },
    { id: 3, label: 'Milestones', icon: CheckCircle },
    { id: 4, label: 'Review', icon: GraduationCap }
  ]

  const handleAIFill = async () => {
    if (!formData.course || !formData.field) {
      toast.error('Please enter your course and field first')
      return
    }

    setIsAIGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setFormData({
        ...formData,
        title: `${formData.course} Research Scholarship`,
        description: `Seeking financial support to pursue excellence in ${formData.field}. This scholarship will enable me to focus on academic excellence, research projects, and professional development opportunities in my chosen field.`,
        targetAmount: '50000',
        milestones: [
          { title: 'Complete First Semester with A+ Grade', deadline: '2024-03-31', description: 'Achieve academic excellence in core subjects' },
          { title: 'Participate in Research Project', deadline: '2024-06-30', description: 'Contribute to meaningful research in my field' },
          { title: 'Present at Academic Conference', deadline: '2024-09-30', description: 'Share research findings with academic community' }
        ]
      })
      toast.success('✨ AI has generated your scholarship details!')
      setIsAIGenerating(false)
    }, 2000)
  }

  const handleSaveDraft = () => {
    localStorage.setItem('scholarship_draft', JSON.stringify(formData))
    toast.success('📄 Draft saved successfully!')
    setIsDraft(true)
  }

  const handleSubmit = async () => {
    if (!isConnected && !isDemo) {
      toast.error('Please connect your wallet to submit the application')
      return
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.targetAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.milestones.length === 0) {
      toast.error('Please add at least one milestone')
      return
    }

    setIsSubmitting(true)

    try {
      const studentAddress = (isConnected && address) ? address : '0xDemoStudent'
      const goalAmount = parseFloat(formData.targetAmount)

      // Simulate blockchain transaction
      toast.loading('Creating scholarship on blockchain...', { id: 'creating' })
      const txHash = await blockchainSimulator.simulateScholarshipCreation(
        studentAddress,
        goalAmount
      )

      // Wait for confirmation
      await blockchainSimulator.waitForConfirmation(txHash)
      toast.success('Transaction confirmed!', { id: 'creating' })

      // Generate scholarship ID
      const scholarshipId = `scholarship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Prepare scholarship data
      const scholarshipData = {
        id: scholarshipId,
        title: formData.title,
        description: formData.description,
        field: formData.field || 'General',
        country: 'Global',
        year: 1,
        goal: goalAmount,
        raised: 0,
        studentWallet: studentAddress,
        institutionName: formData.course || '',
        milestones: formData.milestones.map((m, idx) => ({
          id: `milestone_${idx}`,
          title: m.title,
          description: m.description,
          targetDate: m.deadline,
          status: 'pending' as const
        })),
        verified: false,
        transactionHash: txHash,
        isDemo: isDemo
      }

      // Save to localStorage
      scholarshipStorage.saveScholarship(scholarshipData)

      // Save to Supabase via backend API
      try {
        await scholarshipAPI.create({
          ...scholarshipData,
          is_demo: isDemo
        })
      } catch (apiError) {
        console.warn('Failed to save to Supabase, but saved locally:', apiError)
        // Continue anyway - data is saved locally
      }

      toast.success('🎉 Scholarship application submitted successfully!')
      navigate('/student')
    } catch (error) {
      console.error('Error submitting scholarship:', error)
      toast.error('Failed to submit scholarship. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Wallet Notice Banner */}
          {!isConnected && !isDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start space-x-3"
            >
              <Info className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-200">
                  Connect your wallet to submit the application. You can fill out the form without a wallet.
                </p>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Apply for Scholarship
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete the form below to create your scholarship profile
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    currentStep >= step.id ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.id 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium hidden sm:inline">{step.label}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 ${
                    currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Course
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., Computer Science Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., AI & Machine Learning"
                  />
                </div>

                <button
                  onClick={handleAIFill}
                  disabled={isAIGenerating || !formData.course || !formData.field}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAIGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>AI Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>✨ Apply with AI</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Scholarship Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scholarship Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., Quantum Computing Research Scholarship"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input w-full h-32"
                    placeholder="Describe your goals and how this scholarship will help..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., 50000"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Milestones
                </h2>

                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">
                      {milestone.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {milestone.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Deadline: {milestone.deadline}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Review & Submit
                </h2>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Course:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{formData.course}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Field:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{formData.field}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{formData.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>{' '}
                    <span className="text-gray-900 dark:text-white">₹{formData.targetAmount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Milestones:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{formData.milestones.length}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="btn-outline flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
              )}
              <button
                onClick={handleSaveDraft}
                className="btn-outline flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!isConnected && !isDemo)}
                  className={`flex items-center space-x-2 ${
                    !isConnected && !isDemo
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed px-6 py-3 rounded-lg'
                      : 'btn-primary'
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>{!isConnected && !isDemo ? 'Connect wallet to submit' : 'Submit Application'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ApplyPage

