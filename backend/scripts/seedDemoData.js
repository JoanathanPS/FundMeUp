/**
 * Seed Demo Data Script
 * Auto-populates Supabase with demo scholarships for showcase
 */

const supabase = require('../config/supabase');

// Sample demo scholarships (matching frontend/src/data/sampleScholarships.ts)
const demoScholarships = [
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
        status: 'completed'
      },
      {
        id: 'm2',
        title: 'Build First DApp',
        description: 'Develop and deploy a decentralized application',
        targetDate: '2024-10-15',
        status: 'in_progress'
      }
    ],
    is_demo: true
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
    ],
    is_demo: true
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
    ],
    is_demo: true
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
    ],
    is_demo: true
  }
];

// Sample demo donations
const demoDonations = [
  {
    scholarship_id: 'demo-scholarship-1',
    amount: 25000,
    tx_hash: '0x' + Math.random().toString(16).substr(2, 64),
    network: 'ethereum',
    is_demo: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    scholarship_id: 'demo-scholarship-1',
    amount: 50000,
    tx_hash: '0x' + Math.random().toString(16).substr(2, 64),
    network: 'ethereum',
    is_demo: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    scholarship_id: 'demo-scholarship-2',
    amount: 80000,
    tx_hash: '0x' + Math.random().toString(16).substr(2, 64),
    network: 'ethereum',
    is_demo: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    scholarship_id: 'demo-scholarship-2',
    amount: 40000,
    tx_hash: '0x' + Math.random().toString(16).substr(2, 64),
    network: 'ethereum',
    is_demo: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Check if Supabase has any scholarships
 */
async function hasScholarships() {
  if (!supabase) return false;
  
  try {
    const { count, error } = await supabase
      .from('scholarships')
      .select('*', { count: 'exact', head: true });
    
    return !error && count > 0;
  } catch (error) {
    console.error('Error checking scholarships:', error);
    return false;
  }
}

/**
 * Seed demo data to Supabase
 */
async function seedDemoData() {
  if (!supabase) {
    console.log('⚠️  Supabase not configured. Skipping demo data seeding.');
    return;
  }

  try {
    // Check if data already exists
    const hasData = await hasScholarships();
    if (hasData) {
      console.log('✅ Demo data already exists in Supabase. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding demo data to Supabase...');

    // Insert scholarships
    const { data: scholarships, error: scholarshipsError } = await supabase
      .from('scholarships')
      .insert(demoScholarships.map(s => ({
        ...s,
        milestones: JSON.stringify(s.milestones)
      })))
      .select();

    if (scholarshipsError) {
      console.error('❌ Error seeding scholarships:', scholarshipsError);
      return;
    }

    console.log(`✅ Inserted ${scholarships.length} demo scholarships`);

    // Insert donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .insert(demoDonations)
      .select();

    if (donationsError) {
      console.error('❌ Error seeding donations:', donationsError);
    } else {
      console.log(`✅ Inserted ${donations.length} demo donations`);
    }

    console.log('✅ Demo data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoData()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedDemoData, hasScholarships };

