# Environment Setup Guide

## What are those warnings?

The warnings you see are **informational** - your server is running fine! They just indicate that some **optional features** are not configured:

### ⚠️ Current Warnings Explained:

1. **`CONTRACT_ADDRESS not configured`**
   - **What it means**: Smart contract interactions are disabled
   - **Impact**: You can't interact with blockchain contracts
   - **Required for**: Donations, NFT minting, on-chain transactions
   - **Optional**: Yes - the app works without it for testing

2. **`V2_CONTRACT_ADDRESS not configured`**
   - **What it means**: V2 contract features are disabled
   - **Impact**: Advanced features like impact tokens won't work
   - **Optional**: Yes - only needed for V2 features

3. **`Supabase connection issue`**
   - **What it means**: Database connection failed
   - **Impact**: Data won't be saved to Supabase
   - **Required for**: Storing student data, donations, transactions
   - **Optional**: Yes - but recommended for production

### ✅ What's Working:

- ✅ **AI Service V2** (Groq/Llama) - Working!
- ✅ **Twilio Service** - Working!
- ✅ **IPFS (Pinata)** - Connected!
- ✅ **Server** - Running on port 5000!

---

## Quick Setup (Optional Features)

### 1. Create `.env` file in `backend/` folder:

```bash
cd backend
copy .env.example .env
```

### 2. Configure Supabase (Recommended):

1. Go to [Supabase](https://supabase.com) and create a free project
2. Copy your project URL and anon key
3. Add to `backend/.env`:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Run the SQL schema:
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents from `backend/config/supabase_schema.sql`
   - Run it

### 3. Configure Blockchain (Optional):

**For Local Development:**
```bash
# Start Hardhat local node
cd backend
npm run node

# In another terminal, deploy contracts
npm run deploy:local

# Copy the contract addresses to .env
CONTRACT_ADDRESS=0x...
V2_CONTRACT_ADDRESS=0x...
RPC_URL=http://localhost:8545
```

**For Testnet (Sepolia):**
1. Get RPC URL from [Infura](https://infura.io) or [Alchemy](https://alchemy.com)
2. Deploy contracts: `npm run deploy:sepolia`
3. Add addresses to `.env`

### 4. Configure AI Services (Optional):

**Gemini API:**
1. Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`: `GEMINI_API_KEY=your-key`

**Groq API (Already working!):**
- Already configured if you see "✅ AI Service V2 initialized"

### 5. Configure IPFS/Pinata (Optional):

1. Sign up at [Pinata](https://pinata.cloud)
2. Get API key and secret
3. Add to `.env`:
   ```
   PINATA_API_KEY=your-key
   PINATA_SECRET_KEY=your-secret
   ```

---

## Minimum Setup (Just to Run the App)

**You don't need to configure anything!** The app works with:
- ✅ Frontend: http://localhost:5173
- ✅ Backend API: http://localhost:5000
- ✅ AI features (using Groq)
- ✅ Basic functionality

**Only configure if you need:**
- Database storage (Supabase)
- Blockchain transactions (contract addresses)
- File uploads to IPFS (Pinata)

---

## Restart After Configuration

After updating `.env`, restart the backend:
1. Stop the backend server (Ctrl+C)
2. Run `RUN_APP.bat` again

The warnings will disappear once configured! 🎉

