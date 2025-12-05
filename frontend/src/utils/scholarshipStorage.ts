/**
 * Scholarship storage utilities for tracking scholarships locally
 */

export interface StoredScholarship {
  id: string
  title: string
  description: string
  field: string
  country: string
  year: number
  goal: number
  raised: number
  studentWallet: string
  institutionName?: string
  milestones: Array<{
    id: string
    title: string
    description: string
    targetDate: string
    status: 'pending' | 'in_progress' | 'completed' | 'verified'
  }>
  verified: boolean
  createdAt: string
  transactionHash?: string
  isDemo?: boolean
}

const STORAGE_KEY = 'fundmeup_scholarships'

export const scholarshipStorage = {
  // Save a new scholarship
  saveScholarship: (scholarship: Omit<StoredScholarship, 'id' | 'createdAt'>): StoredScholarship => {
    const scholarships = scholarshipStorage.getAllScholarships()
    const newScholarship: StoredScholarship = {
      ...scholarship,
      id: `scholarship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    scholarships.unshift(newScholarship) // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scholarships))
    return newScholarship
  },

  // Get all scholarships
  getAllScholarships: (): StoredScholarship[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  // Get scholarship by ID
  getScholarshipById: (id: string): StoredScholarship | null => {
    const scholarships = scholarshipStorage.getAllScholarships()
    return scholarships.find(s => s.id === id) || null
  },

  // Get scholarships by student wallet
  getScholarshipsByStudent: (wallet: string): StoredScholarship[] => {
    return scholarshipStorage.getAllScholarships().filter(
      s => s.studentWallet.toLowerCase() === wallet.toLowerCase()
    )
  },

  // Update scholarship
  updateScholarship: (id: string, updates: Partial<StoredScholarship>): StoredScholarship | null => {
    const scholarships = scholarshipStorage.getAllScholarships()
    const index = scholarships.findIndex(s => s.id === id)
    
    if (index === -1) return null
    
    scholarships[index] = { ...scholarships[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scholarships))
    return scholarships[index]
  },

  // Add donation to scholarship (update raised amount)
  addDonation: (scholarshipId: string, amount: number): StoredScholarship | null => {
    const scholarship = scholarshipStorage.getScholarshipById(scholarshipId)
    if (!scholarship) return null
    
    return scholarshipStorage.updateScholarship(scholarshipId, {
      raised: scholarship.raised + amount
    })
  },

  // Update milestone status
  updateMilestone: (
    scholarshipId: string,
    milestoneId: string,
    updates: Partial<StoredScholarship['milestones'][0]>
  ): StoredScholarship | null => {
    const scholarship = scholarshipStorage.getScholarshipById(scholarshipId)
    if (!scholarship) return null
    
    const milestones = scholarship.milestones.map(m => 
      m.id === milestoneId ? { ...m, ...updates } : m
    )
    
    return scholarshipStorage.updateScholarship(scholarshipId, { milestones })
  },

  // Clear all scholarships (for testing)
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }
}

