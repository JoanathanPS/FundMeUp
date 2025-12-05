# FundMeUp - Web3 Scholarship Platform

A decentralized scholarship platform built on blockchain technology, enabling transparent, AI-verified funding for students worldwide.

## Features

- 🎓 **Scholarship Management**: Students can create scholarship applications with milestones
- 💰 **Transparent Donations**: Donors can fund scholarships with full transparency
- ✅ **AI Verification**: Automated verification of student milestones and achievements
- 🏆 **NFT Badges**: Earn NFT badges for donations and milestone completions
- 📊 **Analytics Dashboard**: Track impact, donations, and student progress
- 🔐 **Web3 Integration**: Built with Wagmi and RainbowKit for wallet connectivity

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Wagmi + RainbowKit (Web3)
- React Query
- Supabase (Live Mode)

### Backend
- Node.js + Express
- Supabase (Database)
- Ethers.js (Blockchain)
- AI Services (Groq/Llama, Gemini)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Prototype
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
MONGODB_URI=your-mongodb-uri (optional)
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_DEFAULT_MODE=demo
VITE_API_URL=http://localhost:5000
```

4. Initialize Supabase database:
   - Open Supabase Dashboard → SQL Editor
   - Run `supabase/migrations/001_create_schema.sql`
   - Run `supabase/migrations/002_add_demo_flag.sql`

5. Start the application:
```bash
# Windows
START_APP.bat

# Or manually:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. Open http://localhost:5173

## Demo Mode vs Live Mode

- **Demo Mode** (default): Uses simulated blockchain transactions and sample data. Perfect for testing and showcasing.
- **Live Mode**: Connects to Supabase for real data. Requires wallet connection for transactions.

Toggle modes using `Ctrl+Shift+D` or add `?dev=true` to URL.

## Project Structure

```
Prototype/
├── backend/          # Express.js API server
│   ├── controllers/  # Route controllers
│   ├── routes/       # API routes
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   └── scripts/      # Utility scripts
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── hooks/       # Custom hooks
└── supabase/        # Database migrations
    └── migrations/  # SQL migration files
```

## Deployment

### Vercel Deployment (Frontend)

#### Via Vercel Dashboard:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_DEFAULT_MODE=demo
   VITE_API_URL=https://your-backend-url.com
   ```
6. Deploy!

#### Via Vercel CLI:
```bash
npm i -g vercel
cd frontend
vercel
```

### Backend Deployment

Deploy backend to Railway, Render, Heroku, or any Node.js hosting.

**Required Environment Variables:**
```
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production
```

**Important:** After backend deployment, update `VITE_API_URL` in Vercel to point to your backend URL.

## Environment Variables

See `backend/env.example.txt` and `frontend/env.template.txt` for required variables.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

