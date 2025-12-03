require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const ethersService = require('./utils/ethers');
const ethersV2Service = require('./utils/ethersV2');
const aiServiceV2 = require('./services/aiServiceV2');
const twilioService = require('./services/twilioService');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const proofRoutes = require('./routes/proofRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const microScholarRoutes = require('./routes/microScholarRoutes');
const microScholarV2Routes = require('./routes/microScholarV2Routes');
const aiRoutes = require('./routes/aiRoutes');
const aiRoutesV2 = require('./routes/aiRoutesV2');
const encouragementRoutes = require('./routes/encouragementRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const verificationRoutesV2 = require('./routes/verificationRoutesV2');
const verificationRoutesV3 = require('./routes/verificationRoutesV3');
const emailVerificationRoutes = require('./routes/emailVerification');
const analyticsRoutes = require('./routes/analyticsRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Import middleware
const { sanitizeInput } = require('./middleware/schemaValidation');
const logger = require('./middleware/logger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize Ethers services
ethersService.initialize().catch(err => {
  console.error('Warning: Ethers service initialization failed:', err.message);
  console.log('Server will continue without blockchain functionality');
});

// Initialize EthersV2 service (for MicroScholarV2 contract)
ethersV2Service.initialize().catch(err => {
  console.error('Warning: EthersV2 service initialization failed:', err.message);
  console.log('V2 features will not be available. Deploy V2 contract first.');
});

// Initialize AI Service V2 (Groq/Llama)
aiServiceV2.initialize().catch(err => {
  console.error('Warning: AI Service V2 initialization failed:', err.message);
  console.log('AI features will use fallback responses');
});

// Initialize Twilio Service
twilioService.initialize().catch(err => {
  console.error('Warning: Twilio Service initialization failed:', err.message);
  console.log('Email verification will use mock responses');
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request/Response logging
app.use(logger);

// Sanitize all inputs to prevent XSS
app.use(sanitizeInput);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/create-scholarship', scholarshipRoutes);
app.use('/api/fund-scholarship', scholarshipRoutes);
app.use('/api/proofs', proofRoutes);
app.use('/api/upload-proof', proofRoutes);
app.use('/api/verify-proof', proofRoutes);
app.use('/api/transactions', transactionRoutes);

// MicroScholar Enhanced Routes (V1)
app.use('/api/submit-proof', microScholarRoutes);
app.use('/api/leaderboard', microScholarRoutes);
app.use('/api/feed', microScholarRoutes);

// MicroScholar V2 Routes (Impact Tokens, Auto-Savings, Skill Badges)
app.use('/api/v2', microScholarV2Routes);

// AI & Matching Routes
app.use('/api/ai', aiRoutes);
app.use('/api/ai/v2', aiRoutesV2); // Enhanced AI with Groq

// Community Engagement Routes
app.use('/api/encourage', encouragementRoutes);

// Institution Verification Routes
app.use('/api/verify-institution', verificationRoutes);
app.use('/api/verification', verificationRoutesV2); // Enhanced verification
app.use('/api/verification/v3', verificationRoutesV3); // Email verification
app.use('/api/email', emailVerificationRoutes); // Simple email OTP verification

// Analytics Routes
app.use('/api/analytics', analyticsRoutes);

// Chat Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MicroScholar - Web3 Scholarship Platform API',
    version: '2.0.0',
    features: {
      v2: {
        impactTokens: 'ERC20 ISCR tokens (100 per 1 ETH donated)',
        autoSavings: '10% of funds auto-locked for students',
        skillBadges: 'NFT badges minted on milestone completion',
        progressBadges: 'NFT badges minted on proof verification',
        fundingCircles: 'Multi-donor scholarship support',
        institutionVerifier: 'Role-based verification system',
        aiRiskScores: 'On-chain AI risk scores for milestones'
      }
    },
    endpoints: {
      students: {
        'POST /api/students': 'Create a new student',
        'GET /api/students': 'Get all students',
        'GET /api/students/:wallet': 'Get student by wallet address',
        'PUT /api/students/:wallet': 'Update student profile'
      },
      scholarships: {
        'POST /api/create-scholarship': 'Create a new scholarship',
        'POST /api/fund-scholarship': 'Fund a scholarship',
        'GET /api/scholarships': 'Get all scholarships',
        'GET /api/scholarships/:id': 'Get scholarship by ID'
      },
      proofs: {
        'POST /api/upload-proof': 'Upload proof document',
        'POST /api/verify-proof': 'Verify proof document',
        'GET /api/proofs': 'Get all proofs'
      },
      transactions: {
        'GET /api/transactions': 'Get all transactions',
        'GET /api/transactions/stats': 'Get transaction statistics',
        'GET /api/transactions/wallet/:address': 'Get transactions by wallet',
        'GET /api/transactions/:txHash': 'Get transaction by hash'
      },
      microScholar: {
        'POST /api/submit-proof': 'Submit proof with AI fraud detection',
        'GET /api/leaderboard': 'Get top donors leaderboard',
        'GET /api/feed': 'Get live activity feed (with NFT badges & media)'
      },
      microScholarV2: {
        'POST /api/v2/submit-proof': 'Submit proof (AI + blockchain)',
        'POST /api/v2/fund-scholarship': 'Fund scholarship & earn ISCR tokens',
        'GET /api/v2/funding-circle/:id': 'Get all contributors',
        'POST /api/v2/release-funds': 'Release funds (90/10 split)',
        'POST /api/v2/withdraw-savings': 'Withdraw auto-savings',
        'GET /api/v2/savings/:wallet': 'Get savings balance',
        'POST /api/v2/milestone': 'Add milestone with risk score',
        'POST /api/v2/verify-milestone': 'Verify & mint Skill Badge',
        'GET /api/v2/impact-score/:wallet': 'Get ISCR token balance',
        'POST /api/v2/leaderboard': 'Leaderboard with impact scores',
        'GET /api/v2/feed': 'Enhanced feed (badges, milestones, etc)'
      },
      ai: {
        'POST /api/ai/match': 'Generate AI scholarship matches',
        'GET /api/ai/match/:studentWallet': 'Get match history',
        'GET /api/ai/match/result/:matchId': 'Get specific match result'
      },
      encouragement: {
        'POST /api/encourage': 'Send encouragement message',
        'GET /api/encourage/:studentWallet': 'Get messages for student',
        'GET /api/encourage/donor/:donorAddress': 'Get messages by donor',
        'GET /api/encourage/public/recent': 'Get recent public messages',
        'GET /api/encourage/stats': 'Get encouragement statistics'
      },
      verification: {
        'POST /api/verify-institution': 'Verify student by institution (admin)',
        'POST /api/verify-institution/revoke': 'Revoke verification (admin)',
        'GET /api/verify-institution/verified': 'Get verified students'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 MicroScholar - Web3 Scholarship Platform            ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
║   API Documentation: http://localhost:${PORT}/                ║
║   Health Check: http://localhost:${PORT}/api/health          ║
║                                                           ║
║   Smart Contract: ${process.env.CONTRACT_ADDRESS ? '✓ Connected' : '✗ Not configured'}                   ║
║   IPFS (Pinata): ${process.env.PINATA_API_KEY ? '✓ Connected' : '✗ Not configured'}                    ║
║   AI (Gemini): ${process.env.GEMINI_API_KEY ? '✓ Connected' : '✗ Not configured'}                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

