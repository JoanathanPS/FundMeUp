import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Brain,
  Database,
  Shield,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProofSubmissionProps {
  milestoneId: string
  milestoneTitle: string
  onProofSubmitted?: (proofId: string) => void
}

const ProofSubmission: React.FC<ProofSubmissionProps> = ({ 
  milestoneId, 
  milestoneTitle, 
  onProofSubmitted 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [proofText, setProofText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'uploading' | 'ai_analyzing' | 'completed' | 'error'>('idle')
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Simulate file reading for demo
      const reader = new FileReader()
      reader.onload = (e) => {
        setProofText(e.target?.result as string || '')
      }
      reader.readAsText(file)
    }
  }

  const handleSubmitProof = async () => {
    if (!proofText.trim()) {
      toast.error('Please provide proof text or upload a document')
      return
    }

    setIsUploading(true)
    setSubmissionStatus('uploading')
    setUploadProgress(0)

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(i)
      }

      // Simulate AI analysis
      setSubmissionStatus('ai_analyzing')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock AI analysis result
      const mockAnalysis = {
        riskScore: Math.floor(Math.random() * 30) + 10, // 10-40
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100
        reasoning: "Document analysis shows high authenticity with clear institutional letterhead and proper signatures. The academic content matches expected patterns for this milestone. No signs of manipulation detected.",
        flags: [],
        recommendations: ["Approve milestone", "Release funds automatically"],
        documentAnalysis: {
          quality: 'high' as const,
          authenticity: 'verified' as const,
          completeness: 'complete' as const
        },
        verdict: 'approve' as const,
        aiModel: 'Llama 3.1 70B',
        analyzedAt: new Date().toISOString()
      }

      setAiAnalysis(mockAnalysis)
      setSubmissionStatus('completed')
      
      toast.success('✅ Proof submitted and verified by AI!')
      onProofSubmitted?.(`proof_${Date.now()}`)
      
    } catch (error) {
      console.error('Proof submission failed:', error)
      setSubmissionStatus('error')
      toast.error('Failed to submit proof. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusIcon = () => {
    switch (submissionStatus) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'ai_analyzing':
        return <Brain className="h-5 w-5 text-purple-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Upload className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusMessage = () => {
    switch (submissionStatus) {
      case 'uploading':
        return 'Uploading document...'
      case 'ai_analyzing':
        return 'AI is analyzing your proof...'
      case 'completed':
        return 'Proof verified successfully!'
      case 'error':
        return 'Submission failed. Please try again.'
      default:
        return 'Submit your proof for verification'
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <FileText className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Submit Proof for Milestone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {milestoneTitle}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Document (PDF, Image, or Text)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, PNG, JPG, TXT up to 10MB
              </span>
            </label>
          </div>
          {selectedFile && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proof Description
          </label>
          <textarea
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder="Describe your proof or paste the content here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Submission Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {getStatusMessage()}
          </span>
        </div>

        {submissionStatus === 'uploading' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {submissionStatus === 'ai_analyzing' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-purple-600">
              <Brain className="h-4 w-4" />
              <span>AI analyzing document authenticity...</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Database className="h-4 w-4" />
              <span>Cross-checking with regional database...</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <Shield className="h-4 w-4" />
              <span>Preparing verification report...</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800 dark:text-green-200">
              AI Verification Complete
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Risk Score:</span>
              <span className="ml-2 font-semibold text-green-600">{aiAnalysis.riskScore}/100</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
              <span className="ml-2 font-semibold text-blue-600">{aiAnalysis.confidence}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {aiAnalysis.reasoning}
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmitProof}
        disabled={isUploading || !proofText.trim()}
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <span>
          {isUploading ? 'Processing...' : 'Submit Proof for Verification'}
        </span>
      </button>
    </div>
  )
}

export default ProofSubmission
