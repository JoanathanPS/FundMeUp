require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Scholarship = require('../models/Scholarship');
const Proof = require('../models/Proof');
const Transaction = require('../models/Transaction');
const Encouragement = require('../models/Encouragement');
const DonorImpact = require('../models/DonorImpact');

/**
 * FundMeUp ETHIndia - Comprehensive Mock Data Seeder
 * Currency: Indian Rupees (INR) for scholarships
 * Includes: Students, Donors, Scholarships, Proofs, Transactions, Encouragement
 */

const ETH_TO_INR = 200000; // Approximate conversion rate
const USD_TO_INR = 83; // Approximate conversion rate

// Mock Student Profiles (Diverse Indian Students)
const mockStudents = [
  {
    walletAddress: '0x742d35cc6634c0532925a3b844bc9e7595f0beb2',
    name: 'Priya Sharma',
    email: 'priya.sharma@university.edu',
    institution: 'Indian Institute of Technology Delhi',
    course: 'Computer Science & Engineering',
    yearOfStudy: 3,
    gpa: 3.8,
    bio: 'Passionate about AI and Machine Learning. Building solutions for rural India.',
    dream: 'To create AI-powered healthcare diagnostics accessible to rural communities across India',
    field: 'STEM',
    country: 'India',
    verificationStatus: 'verified',
    verifiedByInstitution: true,
    institutionName: 'IIT Delhi',
    milestones: [
      { title: 'Complete AI/ML Certification', description: 'Advanced machine learning course', status: 'verified', targetDate: '2024-03-15', mediaCID: 'QmTest1' },
      { title: 'Build Healthcare Prototype', description: 'AI diagnostic tool for common diseases', status: 'verified', targetDate: '2024-06-30', mediaCID: 'QmTest2' },
      { title: 'Internship at AI Research Lab', description: 'Summer internship at research institute', status: 'pending', targetDate: '2024-08-15' }
    ],
    totalFundingGoal: 75000, // INR
    fundsRaised: 50000 // INR
  },
  {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.in',
    institution: 'University of Mumbai',
    course: 'Mechanical Engineering',
    yearOfStudy: 2,
    gpa: 3.5,
    bio: 'Engineering enthusiast working on sustainable energy solutions.',
    dream: 'To design affordable solar-powered irrigation systems for Indian farmers',
    field: 'Engineering',
    country: 'India',
    verificationStatus: 'verified',
    verifiedByInstitution: true,
    institutionName: 'University of Mumbai',
    milestones: [
      { title: 'Complete Engineering Fundamentals', description: 'Core mechanical engineering courses', status: 'verified', targetDate: '2024-01-20', mediaCID: 'QmTest3' },
      { title: 'Build Solar Prototype', description: 'Working model of solar irrigation system', status: 'pending', targetDate: '2024-05-30' }
    ],
    totalFundingGoal: 50000,
    fundsRaised: 20000
  },
  {
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Anjali Patel',
    email: 'anjali.patel@nit.edu',
    institution: 'National Institute of Technology Karnataka',
    course: 'Biotechnology',
    yearOfStudy: 4,
    gpa: 3.9,
    bio: 'Researching affordable medical solutions for developing nations.',
    dream: 'To develop low-cost diagnostic kits for infectious diseases prevalent in India',
    field: 'Medicine',
    country: 'India',
    verificationStatus: 'verified',
    verifiedByInstitution: true,
    institutionName: 'NIT Karnataka',
    milestones: [
      { title: 'Research Paper Publication', description: 'Published in international journal', status: 'verified', targetDate: '2024-02-10', mediaCID: 'QmTest4' },
      { title: 'Lab Equipment Funding', description: 'Purchase diagnostic testing equipment', status: 'verified', targetDate: '2024-04-15', mediaCID: 'QmTest5' },
      { title: 'Clinical Trial Phase', description: 'Test diagnostic kit in clinical settings', status: 'pending', targetDate: '2024-07-20' }
    ],
    totalFundingGoal: 100000,
    fundsRaised: 80000
  },
  {
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'Karan Singh',
    email: 'karan.singh@bits.ac.in',
    institution: 'BITS Pilani',
    course: 'Electrical & Electronics Engineering',
    yearOfStudy: 3,
    gpa: 3.7,
    bio: 'Building IoT solutions for smart cities.',
    dream: 'To create smart waste management systems for Indian metropolitan cities',
    field: 'Engineering',
    country: 'India',
    verificationStatus: 'pending',
    verifiedByInstitution: false,
    milestones: [
      { title: 'IoT Course Completion', description: 'Advanced IoT and embedded systems', status: 'pending', targetDate: '2024-04-30' }
    ],
    totalFundingGoal: 60000,
    fundsRaised: 15000
  },
  {
    walletAddress: '0x1111222233334444555566667777888899990000',
    name: 'Meera Iyer',
    email: 'meera.iyer@iisc.edu',
    institution: 'Indian Institute of Science Bangalore',
    course: 'Environmental Science',
    yearOfStudy: 2,
    gpa: 3.6,
    bio: 'Passionate about climate change and sustainable development.',
    dream: 'To develop sustainable water purification systems for rural India',
    field: 'Social Sciences',
    country: 'India',
    verificationStatus: 'verified',
    verifiedByInstitution: true,
    institutionName: 'IISc Bangalore',
    milestones: [
      { title: 'Environmental Research Project', description: 'Study on water quality in rural areas', status: 'verified', targetDate: '2024-03-01', mediaCID: 'QmTest6' },
      { title: 'Prototype Development', description: 'Build low-cost water filter', status: 'pending', targetDate: '2024-06-15' }
    ],
    totalFundingGoal: 55000,
    fundsRaised: 35000
  }
];

// Mock Donor Profiles
const mockDonors = [
  {
    walletAddress: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@donor.com',
    totalDonated: 150000, // INR
    studentsSupported: 3,
    impactScore: 850
  },
  {
    walletAddress: '0xbbbb2222cccc3333dddd4444eeee5555ffff6666',
    name: 'Sunita Agarwal',
    email: 'sunita.agarwal@donor.com',
    totalDonated: 80000,
    studentsSupported: 2,
    impactScore: 620
  },
  {
    walletAddress: '0xcccc3333dddd4444eeee5555ffff6666aaaa7777',
    name: 'Tech Ventures India',
    email: 'info@techventures.in',
    totalDonated: 200000,
    studentsSupported: 4,
    impactScore: 950
  }
];

// Mock Encouragement Messages
const mockEncouragements = [
  {
    donorWallet: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    studentWallet: '0x742d35cc6634c0532925a3b844bc9e7595f0beb2',
    message: 'Priya, your work in AI for healthcare is truly inspiring! Keep innovating for rural India.',
    donorName: 'Dr. Rajesh Kumar'
  },
  {
    donorWallet: '0xbbbb2222cccc3333dddd4444eeee5555ffff6666',
    studentWallet: '0xabcdef1234567890abcdef1234567890abcdef12',
    message: 'Anjali, your research is making a real difference. So proud to support your journey!',
    donorName: 'Sunita Agarwal'
  },
  {
    donorWallet: '0xcccc3333dddd4444eeee5555ffff6666aaaa7777',
    studentWallet: '0x1234567890abcdef1234567890abcdef12345678',
    message: 'Rahul, the future of sustainable energy in India needs innovators like you. Keep building!',
    donorName: 'Tech Ventures India'
  }
];

// Mock Transactions
const mockTransactions = [
  {
    donor: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    student: '0x742d35cc6634c0532925a3b844bc9e7595f0beb2',
    amount: 50000, // INR equivalent in wei
    txHash: '0x' + '1'.repeat(64),
    status: 'completed',
    timestamp: new Date('2024-01-15')
  },
  {
    donor: '0xbbbb2222cccc3333dddd4444eeee5555ffff6666',
    student: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: 80000,
    txHash: '0x' + '2'.repeat(64),
    status: 'completed',
    timestamp: new Date('2024-02-01')
  },
  {
    donor: '0xcccc3333dddd4444eeee5555ffff6666aaaa7777',
    student: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 20000,
    txHash: '0x' + '3'.repeat(64),
    status: 'completed',
    timestamp: new Date('2024-02-15')
  }
];

/**
 * Seed Database
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting FundMeUp Data Seeding (Indian Rupee Edition)...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fundmeup');
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Student.deleteMany({}),
      Scholarship.deleteMany({}),
      Proof.deleteMany({}),
      Transaction.deleteMany({}),
      Encouragement.deleteMany({}),
      DonorImpact.deleteMany({})
    ]);
    console.log('✅ Data cleared\n');

    // Seed Students
    console.log('👨‍🎓 Seeding students...');
    const students = await Student.insertMany(mockStudents);
    console.log(`✅ Created ${students.length} students\n`);

    // Seed Transactions
    console.log('💸 Seeding transactions...');
    const transactions = await Transaction.insertMany(mockTransactions);
    console.log(`✅ Created ${transactions.length} transactions\n`);

    // Seed Encouragement Messages
    console.log('💬 Seeding encouragement messages...');
    const encouragements = await Encouragement.insertMany(mockEncouragements);
    console.log(`✅ Created ${encouragements.length} encouragement messages\n`);

    // Seed Donor Impact Data
    console.log('📊 Seeding donor impact data...');
    const donorImpacts = await DonorImpact.insertMany(mockDonors.map(donor => ({
      donorWallet: donor.walletAddress,
      donorName: donor.name,
      totalDonated: donor.totalDonated,
      studentsSupported: donor.studentsSupported,
      impactScore: donor.impactScore,
      badges: ['Early Supporter', 'Impact Leader'],
      donationHistory: []
    })));
    console.log(`✅ Created ${donorImpacts.length} donor impact records\n`);

    // Display Summary
    console.log('═══════════════════════════════════════');
    console.log('📈 SEED DATA SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Students: ${students.length}`);
    console.log(`Transactions: ${transactions.length}`);
    console.log(`Encouragements: ${encouragements.length}`);
    console.log(`Donor Records: ${donorImpacts.length}`);
    console.log(`Total Funds (mock): ₹${mockDonors.reduce((sum, d) => sum + d.totalDonated, 0).toLocaleString('en-IN')}`);
    console.log('═══════════════════════════════════════\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('Test with:');
    console.log('  GET http://localhost:5000/api/students');
    console.log('  GET http://localhost:5000/api/feed');
    console.log('  GET http://localhost:5000/api/leaderboard\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, mockStudents, mockDonors };

