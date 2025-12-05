/**
 * Demo data for when wallet is not connected or in demo mode
 */

export const demoStudentData = {
  wallet: '0x0000...0000',
  totalFunded: 0,
  progress: 0,
  milestones: [],
  scholarships: [],
  badges: []
}

export const demoDonorData = {
  totalDonated: 0,
  studentsSupported: 0,
  impactTokens: 0,
  donations: []
}

export const getDemoMessage = (page: string) => {
  const messages: Record<string, string> = {
    student: 'Viewing in demo mode. Connect wallet to see your personalized data.',
    donor: 'Viewing in demo mode. Connect wallet to see your donation history.',
    default: 'Connect wallet to perform actions. Viewing is available without a wallet.'
  }
  return messages[page] || messages.default
}

