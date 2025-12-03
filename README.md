# 🎓 FundMeUp - Web3 Scholarship Platform

AI-Powered transparent scholarship platform with blockchain integration.

## 🌟 Features

- 🤖 **AI-Powered Verification**: Groq (Llama 3.1) for eligibility checks and proof analysis
- 🔗 **Blockchain Integration**: Smart contract support with Ethers.js
- 💾 **Real-time Database**: Supabase (PostgreSQL) for live data updates
- 📧 **Email Verification**: Twilio-powered OTP verification
- 📁 **IPFS Storage**: Pinata for decentralized file storage
- 🎨 **Modern UI**: Dark theme with Tailwind CSS
- 📊 **Analytics**: Real-time stats and leaderboards

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key (for AI features)
- Twilio account (for email verification)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Prototype
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

3. **Frontend Setup**
```bash
cd fundmeup-frontend
npm install
cp .env.example .env  # Configure VITE_API_URL
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/

## 📋 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI
GROQ_API_KEY=your_groq_key
AI_PROVIDER=groq

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_SERVICE_SID=your_service_sid

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
PINATA_JWT=your_pinata_jwt

# Blockchain (Optional)
RPC_URL=your_rpc_url
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 API Endpoints

### Students
- `POST /api/students` - Create student profile
- `GET /api/students` - Get all students
- `GET /api/students/:wallet` - Get student by wallet
- `PUT /api/students/:wallet` - Update student profile

### Scholarships
- `POST /api/create-scholarship` - Create new scholarship
- `POST /api/fund-scholarship` - Fund a scholarship
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/:id` - Get scholarship by ID

### Proofs
- `POST /api/upload-proof` - Upload proof document
- `POST /api/verify-proof` - Verify proof document
- `GET /api/proofs` - Get all proofs

### AI Features
- `POST /api/ai/v2/analyze-proof` - AI proof analysis
- `POST /api/ai/v2/verify-eligibility` - Eligibility verification
- `POST /api/ai/v2/generate-encouragement` - Generate messages

### Verification
- `POST /api/verification/v3/request-email` - Request email verification
- `POST /api/verification/v3/verify-email` - Verify email code
- `GET /api/verification/v3/status/:id` - Check verification status

### Analytics
- `GET /api/analytics/global` - Global platform statistics
- `GET /api/analytics/donor/:wallet` - Donor-specific metrics
- `GET /api/analytics/leaderboard` - Top donors and students

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq SDK (Llama 3.1)
- **Email**: Twilio
- **IPFS**: Pinata
- **Blockchain**: Ethers.js

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React Hooks

## 📁 Project Structure

```
Prototype/
├── backend/
│   ├── config/         # Database and service configs
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models (Supabase)
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # External services (AI, Twilio)
│   ├── utils/          # Utilities
│   └── server.js       # Express server
│
├── fundmeup-frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── utils/      # Utilities
│   └── public/         # Static assets
│
└── README.md           # This file
```

## 🎨 Features in Detail

### Student Management
- Create and manage student profiles
- Track academic milestones
- Verification status tracking
- Fund management

### Scholarship System
- Create custom scholarships
- Multiple funding sources
- Progress tracking
- Impact measurement

### AI Verification
- Eligibility assessment
- Proof document analysis
- Fraud detection
- Personalized recommendations

### Real-time Updates
- Live data synchronization
- Instant notifications
- Dynamic analytics
- Interactive dashboards

## 🔐 Security

- Input sanitization
- XSS prevention
- CORS configuration
- Environment variable protection
- Validation middleware

## 📊 Database Schema

See `backend/config/supabase_schema_improved.sql` for complete schema including:
- Students table
- Scholarships table
- Proofs table
- Transactions table
- Milestones table
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Supabase for database hosting
- Groq for AI capabilities
- Twilio for email verification
- Pinata for IPFS storage
- Ethereum Foundation for blockchain infrastructure

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for transparent education funding**
