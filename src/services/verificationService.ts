import { api } from './api'

export interface VerificationRequest {
  wallet: string
  studentId: string
  documents: string[]
  institution?: string
  region?: string
  gpa?: number
}

export interface VerificationStatus {
  status: 'pending' | 'ai_reviewing' | 'region_checking' | 'admin_review' | 'verified' | 'rejected'
  aiScore: number
  regionCheck: boolean
  aiConfidence: number
  regionalVerified: boolean
  adminApproved: boolean
  soulboundNFT?: string
  verificationSteps: {
    aiVerification: boolean
    regionalVerification: boolean
    adminApproval: boolean
  }
  aiAnalysis?: {
    riskScore: number
    confidence: number
    reasoning: string
    flags: string[]
    recommendations: string[]
  }
  regionalAnalysis?: {
    verified: boolean
    confidence: number
    reasoning: string
    institutionData?: any
  }
  createdAt: string
  updatedAt: string
}

export interface VerificationResponse {
  success: boolean
  message: string
  data: VerificationStatus
}

class VerificationService {
  /**
   * Submit verification request
   */
  async submitVerificationRequest(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await api.post('/verification/request', request)
      return response.data
    } catch (error) {
      console.error('Verification request failed:', error)
      throw error
    }
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(wallet: string): Promise<VerificationResponse> {
    try {
      const response = await api.get(`/verification/status/${wallet}`)
      return response.data
    } catch (error) {
      console.error('Failed to get verification status:', error)
      throw error
    }
  }

  /**
   * Approve verification (admin only)
   */
  async approveVerification(wallet: string, approverWallet: string): Promise<VerificationResponse> {
    try {
      const response = await api.post('/verification/approve', {
        walletAddress: wallet,
        approverWallet,
        institutionName: 'FundMeUp Admin',
        notes: 'Approved by system admin'
      })
      return response.data
    } catch (error) {
      console.error('Verification approval failed:', error)
      throw error
    }
  }

  /**
   * Get pending verifications (admin only)
   */
  async getPendingVerifications(): Promise<VerificationResponse> {
    try {
      const response = await api.get('/verification/pending')
      return response.data
    } catch (error) {
      console.error('Failed to get pending verifications:', error)
      throw error
    }
  }

  /**
   * Mock verification process for demo
   */
  async mockVerificationProcess(wallet: string): Promise<VerificationStatus> {
    // Simulate the verification process with realistic delays
    const steps = [
      { status: 'pending', message: 'Verification request submitted' },
      { status: 'ai_reviewing', message: 'AI analyzing documents...' },
      { status: 'region_checking', message: 'Cross-checking regional database...' },
      { status: 'admin_review', message: 'Awaiting admin approval...' },
      { status: 'verified', message: 'Verification complete!' }
    ]

    let currentStep = 0
    const processStatus: VerificationStatus = {
      status: 'pending',
      aiScore: 0,
      regionCheck: false,
      aiConfidence: 0,
      regionalVerified: false,
      adminApproved: false,
      verificationSteps: {
        aiVerification: false,
        regionalVerification: false,
        adminApproval: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Simulate AI verification
    setTimeout(() => {
      processStatus.status = 'ai_reviewing'
      processStatus.aiScore = 87
      processStatus.aiConfidence = 91
      processStatus.verificationSteps.aiVerification = true
      processStatus.aiAnalysis = {
        riskScore: 15,
        confidence: 91,
        reasoning: "Document analysis shows high authenticity with clear institutional letterhead and proper signatures. No signs of manipulation detected.",
        flags: [],
        recommendations: ["Approve milestone", "Release funds automatically"]
      }
      processStatus.updatedAt = new Date().toISOString()
    }, 2000)

    // Simulate regional verification
    setTimeout(() => {
      processStatus.status = 'region_checking'
      processStatus.regionCheck = true
      processStatus.regionalVerified = true
      processStatus.verificationSteps.regionalVerification = true
      processStatus.regionalAnalysis = {
        verified: true,
        confidence: 95,
        reasoning: "Institution verified in Kerala government database. Performance score: 8.7/10",
        institutionData: {
          schoolName: "Indian Institute of Technology Delhi",
          avgPerformanceScore: 8.7,
          verifiedByGov: true
        }
      }
      processStatus.updatedAt = new Date().toISOString()
    }, 4000)

    // Simulate admin approval
    setTimeout(() => {
      processStatus.status = 'admin_review'
      processStatus.adminApproved = true
      processStatus.verificationSteps.adminApproval = true
      processStatus.updatedAt = new Date().toISOString()
    }, 6000)

    // Final verification
    setTimeout(() => {
      processStatus.status = 'verified'
      processStatus.soulboundNFT = `0x${Math.random().toString(16).substr(2, 40)}`
      processStatus.updatedAt = new Date().toISOString()
    }, 8000)

    return processStatus
  }
}

export default new VerificationService()
