import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Target, Award, CheckCircle } from 'lucide-react'
import ProofSubmission from '@/components/ProofSubmission'

const SubmitProof = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)

  const mockMilestones = [
    {
      id: '1',
      title: 'Complete Advanced Physics Course',
      description: 'Master quantum mechanics fundamentals and complete all coursework with A+ grade',
      status: 'in_progress' as const,
      targetDate: '2024-02-15'
    },
    {
      id: '2',
      title: 'Research Paper Publication',
      description: 'Publish findings on quantum algorithms in a peer-reviewed journal',
      status: 'pending' as const,
      targetDate: '2024-04-30'
    },
    {
      id: '3',
      title: 'Internship at Tech Giant',
      description: 'Gain industry experience at a leading technology company',
      status: 'pending' as const,
      targetDate: '2024-06-15'
    }
  ]

  const handleProofSubmitted = (proofId: string) => {
    console.log('Proof submitted:', proofId)
    // Handle proof submission success
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Milestone Proof
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your proof documents and let our AI verify your progress
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Milestone Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Select Milestone
            </h2>
            {mockMilestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMilestone === milestone.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    milestone.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                    milestone.status === 'in_progress' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : milestone.status === 'in_progress' ? (
                      <Target className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Award className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Target: {milestone.targetDate}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                        milestone.status === 'in_progress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Proof Submission */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {selectedMilestone ? (
              <ProofSubmission
                milestoneId={selectedMilestone}
                milestoneTitle={mockMilestones.find(m => m.id === selectedMilestone)?.title || ''}
                onProofSubmitted={handleProofSubmitted}
              />
            ) : (
              <div className="card p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Milestone
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a milestone from the list to submit your proof
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SubmitProof
