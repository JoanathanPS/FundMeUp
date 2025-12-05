/**
 * Sample scholarships data for Demo Mode
 * This data is used when the app is in demo mode
 */

export interface Scholarship {
  id: string
  title: string
  description: string
  country: string
  field: string
  year: number
  goal: number
  raised: number
  milestones: Array<{
    id: string
    title: string
    description: string
    targetDate: string
    status: 'pending' | 'in_progress' | 'completed' | 'verified'
    mediaCID?: string
  }>
  verified: boolean
  created_at: string
  student_wallet?: string
  institution_name?: string
}

export const sampleScholarships: Scholarship[] = [
  {
    id: 'demo-scholarship-1',
    title: 'Web3 Development Scholarship',
    description: 'Supporting students learning blockchain development, smart contracts, and decentralized applications.',
    country: 'Global',
    field: 'Blockchain Development',
    year: 2,
    goal: 100000,
    raised: 75000,
    verified: true,
    created_at: '2024-06-01T00:00:00Z',
    student_wallet: '0xDemoStudent1',
    institution_name: 'Virtual Blockchain Academy',
    milestones: [
      {
        id: 'm1',
        title: 'Complete Solidity Course',
        description: 'Master smart contract development',
        targetDate: '2024-07-31',
        status: 'completed',
        mediaCID: 'QmSolidityProof'
      },
      {
        id: 'm2',
        title: 'Build First DApp',
        description: 'Develop and deploy a decentralized application',
        targetDate: '2024-10-15',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'demo-scholarship-2',
    title: 'Quantum Computing Research',
    description: 'Funding for students pursuing quantum computing research and algorithm development.',
    country: 'India',
    field: 'Computer Science',
    year: 3,
    goal: 150000,
    raised: 120000,
    verified: true,
    created_at: '2024-05-15T00:00:00Z',
    student_wallet: '0xDemoStudent2',
    institution_name: 'IIT Delhi',
    milestones: [
      {
        id: 'm1',
        title: 'Complete Advanced Physics Course',
        description: 'Master quantum mechanics fundamentals',
        targetDate: '2024-02-15',
        status: 'completed'
      },
      {
        id: 'm2',
        title: 'Research Paper Publication',
        description: 'Publish findings on quantum algorithms',
        targetDate: '2024-04-30',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'demo-scholarship-3',
    title: 'Sustainable Energy Solutions',
    description: 'Supporting students developing renewable energy technologies and sustainable solutions.',
    country: 'Kenya',
    field: 'Environmental Engineering',
    year: 2,
    goal: 80000,
    raised: 45000,
    verified: true,
    created_at: '2024-04-20T00:00:00Z',
    student_wallet: '0xDemoStudent3',
    institution_name: 'University of Nairobi',
    milestones: [
      {
        id: 'm1',
        title: 'Solar Panel Design Project',
        description: 'Create efficient solar panel prototype',
        targetDate: '2024-01-30',
        status: 'completed'
      },
      {
        id: 'm2',
        title: 'Community Impact Study',
        description: 'Analyze local energy needs',
        targetDate: '2024-03-15',
        status: 'completed'
      }
    ]
  },
  {
    id: 'demo-scholarship-4',
    title: 'AI for Medical Diagnosis',
    description: 'Funding for biomedical engineering students developing AI-powered medical diagnostic tools.',
    country: 'India',
    field: 'Biomedical Engineering',
    year: 4,
    goal: 200000,
    raised: 180000,
    verified: true,
    created_at: '2024-03-10T00:00:00Z',
    student_wallet: '0xDemoStudent4',
    institution_name: 'AIIMS Delhi',
    milestones: [
      {
        id: 'm1',
        title: 'Machine Learning Certification',
        description: 'Complete advanced ML course',
        targetDate: '2024-01-15',
        status: 'completed'
      },
      {
        id: 'm2',
        title: 'Medical Dataset Collection',
        description: 'Gather diagnostic imaging data',
        targetDate: '2024-03-01',
        status: 'completed'
      },
      {
        id: 'm3',
        title: 'Clinical Trial Phase',
        description: 'Test AI model in hospital setting',
        targetDate: '2024-06-30',
        status: 'pending'
      }
    ]
  }
]

