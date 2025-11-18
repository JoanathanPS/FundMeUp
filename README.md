# FundMeUp – AI-Enhanced Web3 Scholarship Platform

**Transparent, verifiable, and milestone-based student funding.**

FundMeUp brings together modern verification systems, regional data intelligence, and blockchain technology to create a scholarship ecosystem where students, donors, and institutions can participate with full trust and transparency.

---

### 🚀 Live Deployment  
**https://fundmeup.vercel.app/**

---

## 🌍 Overview

Traditional scholarship programs struggle with:

- Limited transparency in fund distribution  
- High administrative overhead  
- Manual verification processes that are slow and error-prone  
- Minimal insight into whether funds reach deserving students  

In India alone, over ₹50,000 crore in scholarships are disbursed annually—yet a significant portion never reaches the intended recipients due to inefficiencies.

**FundMeUp** provides a modern, verifiable, and transparent approach to solving this problem.

---

## 🔍 What FundMeUp Does

FundMeUp ensures that scholarship disbursements are:

- **Accurately verified** through a multi-step process  
- **Released only after verified student progress**  
- **Fully traceable** through blockchain logging  
- **Fair and standardized**, reducing manual bias  

---

## 🧩 Core Components

### 1. Verification Workflow  
A structured verification pipeline:

- **Email Verification:** Confirms institutional email identity  
- **Document Verification:** AI-assisted review of student documents  
- **Regional Data Check:** Matches against state-level education datasets  

All three steps must succeed for a student to achieve full verification status.

### 2. Regional Data Intelligence  
The platform integrates with real educational datasets to validate:

- Student eligibility  
- Institution authenticity  
- Compliance with state scholarship criteria  

(Current support: Kerala, Tamil Nadu, Maharashtra)

### 3. Blockchain-Based Funding  
Blockchain enables:

- Transparent, immutable transaction logs  
- Milestone-based fund release  
- Soulbound NFT identity for verified students  
- Real-time donor impact tracking  

---

## ⭐ Key Features

### For Students
- Multi-layer verification process  
- Milestone-based funding  
- AI-driven document analysis  
- Transparent progress tracking  
- NFT identity badge  

### For Donors
- Real-time visibility into fund usage  
- Platform-wide analytics  
- Impact scoring and tracking  
- Automated recommendations  

### For Institutions
- Automated verification workflows  
- Reduced administrative burden  
- Dashboard for student monitoring  
- Regional dataset integration  

---

## 🛠️ Tech Stack

### **Frontend**
- React (TypeScript)  
- TailwindCSS  
- Framer Motion  
- Wagmi + RainbowKit  
- React Query  

### **Backend**
- Node.js (Express)  
- MongoDB  
- Groq / Llama 3.1 for AI analysis  
- IPFS for document storage  
- JWT authentication  

### **Blockchain**
- Solidity Smart Contracts  
- Hardhat  
- Ethers.js  
- Soulbound NFTs  
- On-chain milestone system  

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+  
- MongoDB  
- MetaMask (or any EVM-compatible wallet)  
- Groq API key (for AI document analysis)  

---

## 🔧 Installation

### Clone the repository:
```bash
git clone https://github.com/your-username/FundMeUp.git
cd FundMeUp
```

### Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../fundmeup-frontend
npm install
```

---

## ⚙️ Environment Variables

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/fundmeup
GROQ_API_KEY=your_groq_api_key
RPC_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_private_key
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## ▶️ Running the Project

### Backend + Blockchain
```bash
cd backend
npm run node                 # Start Hardhat node
npm run deploy:v3:local      # Deploy smart contracts
node seed/seedDataV2.js      # Seed database (optional)
npm run dev                  # Start backend on port 5000
```

### Frontend
```bash
cd fundmeup-frontend
npm run dev                  # Start frontend on port 5173
```

---

## 📊 Demo Pages

### **AI Verification Demo**  
`/ai-demo` – document analysis scenarios.

### **Analytics Dashboard**  
`/analytics` – global platform metrics:  
- Funding trends  
- Geographic distribution  
- Student/donor insights  

### **Student Dashboard**  
- Milestone progress  
- Verification status  
- NFT Identity  
- Funding timeline  

---

## 🔌 API Endpoints (Summary)

### AI
- `POST /api/ai/v2/analyze-proof`  
- `POST /api/ai/v2/verify-eligibility`  
- `POST /api/ai/v2/generate-encouragement`  

### Verification
- `POST /api/verification/request`  
- `GET /api/verification/status/:wallet`  
- `POST /api/verification/approve`  

### Email
- `POST /api/verification/v3/request-email`  
- `POST /api/verification/v3/verify-email`  
- `GET /api/verification/v3/status/:id`  

### Analytics
- `GET /api/analytics/global`  
- `GET /api/analytics/donor/:wallet`  
- `GET /api/analytics/heatmap`  
- `GET /api/analytics/trends`  

---

## 🔒 Security

- Audited smart contracts  
- AI-based fraud detection  
- Encrypted document storage (IPFS)  
- Immutable on-chain tracking  
- Soulbound identity NFTs  

---

## 🤝 Contributing

We welcome contributions!  
Please read the **CONTRIBUTING.md** before opening a pull request.

---

## 📄 License

Licensed under the **MIT License**.

---

## 🌱 Roadmap

### Upcoming
- Multi-language support  
- Mobile application  
- Additional state-level integrations  
- Expanded analytics  
- Cross-chain features  
- Donor-side DeFi integrations  

---

**FundMeUp — A transparent, reliable, and modern approach to education funding.**
