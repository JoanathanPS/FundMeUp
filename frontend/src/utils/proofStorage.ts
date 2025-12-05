/**
 * Proof storage utilities for tracking milestone proofs locally
 */

export interface StoredProof {
  id: string
  scholarshipId: string
  milestoneId: string
  milestoneTitle: string
  cid: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  description?: string
  submittedAt: string
  verifiedAt?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  riskScore?: number
  aiConfidence?: number
  transactionHash?: string
  isDemo?: boolean
}

const STORAGE_KEY = 'fundmeup_proofs'

export const proofStorage = {
  // Save a new proof
  saveProof: (proof: Omit<StoredProof, 'id' | 'submittedAt'>): StoredProof => {
    const proofs = proofStorage.getAllProofs()
    const newProof: StoredProof = {
      ...proof,
      id: `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      verificationStatus: proof.verificationStatus || 'pending'
    }
    proofs.unshift(newProof) // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs))
    return newProof
  },

  // Get all proofs
  getAllProofs: (): StoredProof[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  // Get proof by ID
  getProofById: (id: string): StoredProof | null => {
    const proofs = proofStorage.getAllProofs()
    return proofs.find(p => p.id === id) || null
  },

  // Get proofs by scholarship
  getProofsByScholarship: (scholarshipId: string): StoredProof[] => {
    return proofStorage.getAllProofs().filter(p => p.scholarshipId === scholarshipId)
  },

  // Get proof by milestone
  getProofByMilestone: (milestoneId: string): StoredProof | null => {
    const proofs = proofStorage.getAllProofs()
    return proofs.find(p => p.milestoneId === milestoneId) || null
  },

  // Update proof verification status
  updateVerification: (
    proofId: string,
    status: 'verified' | 'rejected',
    riskScore?: number,
    aiConfidence?: number
  ): StoredProof | null => {
    const proofs = proofStorage.getAllProofs()
    const index = proofs.findIndex(p => p.id === proofId)
    
    if (index === -1) return null
    
    proofs[index] = {
      ...proofs[index],
      verificationStatus: status,
      verifiedAt: new Date().toISOString(),
      riskScore,
      aiConfidence
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs))
    return proofs[index]
  },

  // Clear all proofs (for testing)
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }
}

