// Donation storage utilities for tracking donations locally

export interface Donation {
  id: string
  studentId: string
  studentName: string
  amount: number
  timestamp: string
  milestone?: string
  transactionHash?: string
}

const STORAGE_KEY = 'fundmeup_donations'

export const donationStorage = {
  // Save a new donation
  saveDonation: (donation: Omit<Donation, 'id' | 'timestamp'>): Donation => {
    const donations = donationStorage.getAllDonations()
    const newDonation: Donation = {
      ...donation,
      id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
    donations.unshift(newDonation) // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations))
    return newDonation
  },

  // Get all donations
  getAllDonations: (): Donation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  // Get donations by student
  getDonationsByStudent: (studentId: string): Donation[] => {
    return donationStorage.getAllDonations().filter(d => d.studentId === studentId)
  },

  // Get total donated amount
  getTotalDonated: (): number => {
    return donationStorage.getAllDonations().reduce((sum, d) => sum + d.amount, 0)
  },

  // Get donation count
  getDonationCount: (): number => {
    return donationStorage.getAllDonations().length
  },

  // Clear all donations (for testing)
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }
}

