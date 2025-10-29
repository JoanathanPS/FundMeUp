# 🎓 FundMeUp Frontend

A modern Web3 scholarship platform built with React, TypeScript, and TailwindCSS.

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, responsive design with Framer Motion animations
- 🔗 **Web3 Integration** - Wagmi + RainbowKit for wallet connection
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎯 **Real-time Updates** - Live activity feed and notifications
- 🏆 **Leaderboards** - Track top donors and students
- 🎖️ **NFT Badges** - Earn unique achievements for milestones
- 🤖 **AI Integration** - Smart matching and risk analysis
- 🌐 **Multi-chain** - Support for Ethereum, Sepolia, and Hardhat

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd fundmeup-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example.txt .env
   ```

4. **Configure environment variables:**
   Edit `.env` with your values:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   VITE_WALLETCONNECT_PROJECT_ID=your-project-id
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
fundmeup-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Sidebar.tsx     # Mobile sidebar
│   │   ├── WalletConnectButton.tsx
│   │   ├── StudentCard.tsx
│   │   ├── MilestoneProgressBar.tsx
│   │   ├── DonationModal.tsx
│   │   ├── NFTBadgeDisplay.tsx
│   │   └── Loader.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── StudentDashboard.tsx
│   │   ├── SubmitProof.tsx
│   │   ├── DonorDashboard.tsx
│   │   ├── ImpactFeed.tsx
│   │   └── Leaderboard.tsx
│   ├── services/           # API and Web3 services
│   │   ├── api.ts         # Backend API client
│   │   └── web3.ts        # Web3 utilities
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary:** `#F97316` (Orange)
- **Secondary:** `#1E3A8A` (Navy)
- **Success:** `#10B981` (Green)
- **Warning:** `#F59E0B` (Yellow)
- **Danger:** `#EF4444` (Red)

### Typography
- **Font Family:** Inter (body), Poppins (headings)
- **Sizes:** Responsive scale from text-sm to text-7xl

### Components
- **Cards:** Rounded corners, subtle shadows, hover effects
- **Buttons:** Multiple variants (primary, secondary, outline, ghost)
- **Forms:** Clean inputs with focus states
- **Animations:** Smooth transitions with Framer Motion

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_CONTRACT_ADDRESS` | Smart contract address | Required |
| `VITE_RPC_URL` | Ethereum RPC URL | `http://127.0.0.1:8545` |
| `VITE_CHAIN_ID` | Chain ID | `31337` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Required |
| `VITE_ALCHEMY_API_KEY` | Alchemy API key | Optional |
| `VITE_ENABLE_WEB3` | Enable Web3 features | `true` |
| `VITE_ENABLE_AI` | Enable AI features | `true` |

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Dark mode support

## 📱 Pages Overview

### 1. Home (`/`)
- Hero section with mission statement
- Global statistics
- Feature highlights
- Call-to-action buttons

### 2. Student Dashboard (`/student`)
- Personal profile overview
- Milestone progress tracking
- NFT badges display
- Transaction history

### 3. Submit Proof (`/student/upload`)
- File upload interface
- Milestone creation form
- AI risk analysis
- Blockchain submission

### 4. Donor Dashboard (`/donor`)
- Browse all students
- Search and filter options
- Donation interface
- Impact tracking

### 5. Impact Feed (`/feed`)
- Real-time activity updates
- Filter by activity type
- Transaction links
- Celebration animations

### 6. Leaderboard (`/leaderboard`)
- Top donors ranking
- Top students ranking
- Statistics overview
- Time period filters

## 🔗 Web3 Integration

### Wallet Connection
- **RainbowKit** for wallet selection
- **Wagmi** for Web3 interactions
- Support for MetaMask, WalletConnect, and more

### Smart Contract Interaction
- **Ethers.js** for contract calls
- Automatic network switching
- Transaction status tracking
- Error handling

### Supported Networks
- **Hardhat Local** (Development)
- **Sepolia Testnet** (Testing)
- **Ethereum Mainnet** (Production)

## 🎭 Animations

### Framer Motion
- Page transitions
- Component animations
- Hover effects
- Loading states
- Celebration effects

### Custom Animations
- Floating elements
- Glow effects
- Celebration confetti
- Progress bars
- Card hover effects

## 📊 State Management

### React Query
- Server state management
- Caching and synchronization
- Background updates
- Error handling

### Local State
- React hooks for component state
- Form state management
- UI state (modals, filters)

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically**

### Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Set environment variables**

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder to your server**

3. **Configure web server for SPA routing**

## 🔧 Troubleshooting

### Common Issues

**Wallet not connecting:**
- Check if MetaMask is installed
- Verify network configuration
- Check WalletConnect project ID

**API errors:**
- Ensure backend is running
- Check API URL configuration
- Verify CORS settings

**Build errors:**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify environment variables

### Debug Mode

Enable debug logging by setting:
```env
VITE_NODE_ENV=development
```

## 📚 API Integration

### Backend Endpoints

The frontend integrates with these backend endpoints:

- `GET /api/students` - List all students
- `GET /api/students/:wallet` - Get student by wallet
- `POST /api/students` - Create student profile
- `POST /api/proofs` - Submit proof
- `GET /api/feed` - Get activity feed
- `GET /api/leaderboard/donors` - Get donor leaderboard
- `POST /api/ai/match` - AI matching
- `POST /api/ai/ocr-risk` - Risk analysis

### Error Handling

- Global error boundary
- API error interceptors
- User-friendly error messages
- Retry mechanisms

## 🎯 Performance

### Optimization Features

- **Code splitting** with dynamic imports
- **Image optimization** with lazy loading
- **Bundle analysis** with Vite
- **Caching** with React Query
- **Tree shaking** for smaller bundles

### Performance Metrics

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.0s

## 🔒 Security

### Security Features

- **Input validation** on all forms
- **XSS protection** with sanitization
- **CSRF protection** with tokens
- **Secure headers** configuration
- **Environment variable** protection

## 📈 Analytics

### Tracking Setup

Add your analytics provider:

```typescript
// src/utils/analytics.ts
export const trackEvent = (event: string, data?: any) => {
  // Your analytics implementation
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
3. **Make changes**
4. **Add tests**
5. **Submit pull request**

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Documentation:** [GitHub Wiki](https://github.com/your-repo/wiki)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discord:** [Community Server](https://discord.gg/your-server)

---

**Built with ❤️ for the Web3 education revolution**


