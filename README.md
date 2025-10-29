# FundMeUp - Web3 Scholarship Platform

![FundMeUp Logo](https://img.shields.io/badge/FundMeUp-Web3%20Scholarships-orange?style=for-the-badge&logo=ethereum)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

The world's first Web3-powered scholarship platform where donors fund student dreams and track impact through blockchain-verified milestones, NFTs, and smart contracts.

## 🌟 Features

### 🎓 For Students
- **Smart Scholarship Applications** - AI-powered matching with relevant funding opportunities
- **Blockchain-Verified Milestones** - Transparent progress tracking with immutable records
- **NFT Achievement Badges** - Earn unique digital credentials for completed milestones
- **Auto-Savings Micro-Wallet** - 90% funds released, 10% locked as savings
- **Institution Verification** - Verified by educational institutions for credibility

### 💰 For Donors
- **Impact Token Rewards** - Earn ImpactScore (ISCR) tokens for every contribution
- **Transparent Fund Tracking** - See exactly where your donations go
- **AI-Powered Matching** - Connect with students whose dreams align with your values
- **Community Engagement** - Send encouragement messages and track impact
- **Funding Circles** - Collaborate with other donors on scholarship funding

### 🏛️ For Institutions
- **Verification System** - Verify student credentials and achievements
- **Impact Analytics** - Track the success of your verified students
- **Transparent Reporting** - Generate reports on scholarship outcomes

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching

### Web3 Integration
- **Wagmi** for Ethereum interactions
- **RainbowKit** for wallet connection
- **Ethers.js** for blockchain operations
- **Viem** for type-safe Ethereum interactions

### UI/UX
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Responsive Design** for all devices
- **Dark Theme** with custom gradients

## 📁 Project Structure

```
fundmeup-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── Loader.tsx
│   │   ├── MilestoneProgressBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── NFTBadgeDisplay.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StudentCard.tsx
│   │   └── WalletConnectButton.tsx
│   ├── pages/
│   │   ├── DonorDashboard.tsx
│   │   ├── Home.tsx
│   │   ├── ImpactFeed.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── SubmitProof.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── web3.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/JoanathanPS/FundMeUp.git
cd FundMeUp/fundmeup-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=your_contract_address
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎨 Design System

### Color Palette
- **Primary Orange**: #F97316
- **Secondary Navy**: #1E3A8A
- **Success Green**: #22c55e
- **Warning Yellow**: #f59e0b
- **Danger Red**: #ef4444

### Typography
- **Primary Font**: Inter (300, 400, 500, 600, 700)
- **Display Font**: Poppins (400, 500, 600, 700, 800)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Standard and hover effects
- **Badges**: Status indicators with color coding
- **Inputs**: Form elements with focus states

## 🔗 API Integration

The frontend integrates with the FundMeUp backend API:

### Student Endpoints
- `POST /students` - Create student profile
- `GET /students/:wallet` - Get student details
- `POST /submit-proof` - Submit milestone proof

### Scholarship Endpoints
- `POST /create-scholarship` - Create new scholarship
- `POST /fund-scholarship` - Fund a scholarship
- `POST /verify-proof` - Verify milestone proof

### AI Endpoints
- `POST /ai/analyze-profile` - AI profile analysis
- `POST /ai/ocr-risk` - OCR fraud detection
- `POST /ai/generate-message` - Generate encouragement messages

## 🌐 Web3 Features

### Smart Contract Integration
- **Scholarship Creation** - Deploy scholarship contracts
- **Funding** - Send ETH to scholarship contracts
- **Milestone Verification** - Verify proofs on-chain
- **NFT Minting** - Mint achievement badges
- **Impact Tokens** - Mint ISCR tokens for donors

### Supported Networks
- **Ethereum Mainnet**
- **Sepolia Testnet**
- **Hardhat Local**

### Wallet Support
- **MetaMask**
- **WalletConnect**
- **Coinbase Wallet**
- **Rainbow Wallet**

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** for smart contract standards
- **TailwindCSS** for the utility-first CSS framework
- **React** team for the amazing framework
- **Ethereum** community for Web3 infrastructure
- **RainbowKit** for wallet integration

## 📞 Support

For support, email support@fundmeup.io or join our Discord community.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with more blockchains
- [ ] AI-powered impact prediction
- [ ] Social features and community building

---

**Built with ❤️ for the future of education**

*Empowering dreams through blockchain technology*
