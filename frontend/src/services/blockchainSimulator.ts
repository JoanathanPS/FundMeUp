/**
 * Blockchain Simulator Service
 * Simulates blockchain transactions for demo mode with realistic hashes and flow
 */

export interface Transaction {
  hash: string
  from: string
  to?: string
  value: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  blockNumber?: number
  gasUsed?: string
  gasPrice?: string
  type: 'donation' | 'scholarship_creation' | 'proof_submission' | 'nft_mint'
  metadata?: Record<string, any>
}

export interface NFTMetadata {
  tokenId: number
  donorAddress: string
  studentAddress: string
  studentName: string
  amount: number
  milestoneId?: string
  milestoneTitle?: string
  type: 'donation' | 'achievement'
  imageUrl: string
  description: string
  mintedAt: string
  transactionHash: string
}

const STORAGE_KEY = 'fundmeup_blockchain_state'
const NFT_STORAGE_KEY = 'fundmeup_nfts'

interface BlockchainState {
  transactions: Transaction[]
  balances: Record<string, string> // address -> balance (in wei, as string)
  nftCounter: number
  blockNumber: number
}

// Initialize blockchain state
const getState = (): BlockchainState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading blockchain state:', e)
  }
  
  return {
    transactions: [],
    balances: {},
    nftCounter: 0,
    blockNumber: 10000000
  }
}

const saveState = (state: BlockchainState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Error saving blockchain state:', e)
  }
}

// Generate realistic Ethereum transaction hash
const generateTxHash = (): string => {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

// Generate realistic IPFS CID
const generateCID = (): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let cid = 'Qm'
  for (let i = 0; i < 42; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)]
  }
  return cid
}

// Convert ETH to Wei (as string to avoid precision issues)
const ethToWei = (eth: number): string => {
  return (eth * 1e18).toString()
}

// Convert Wei to ETH
const weiToEth = (wei: string): number => {
  return parseFloat(wei) / 1e18
}

export const blockchainSimulator = {
  /**
   * Simulate a donation transaction
   */
  async simulateDonation(
    scholarshipId: string,
    amount: number, // in INR (will be converted to ETH equivalent)
    fromAddress: string
  ): Promise<string> {
    const state = getState()
    const txHash = generateTxHash()
    
    // Convert INR to ETH (rough estimate: 1 ETH = 300,000 INR)
    const ethAmount = amount / 300000
    const weiAmount = ethToWei(ethAmount)
    
    // Create pending transaction
    const transaction: Transaction = {
      hash: txHash,
      from: fromAddress,
      value: weiAmount,
      status: 'pending',
      timestamp: Date.now(),
      type: 'donation',
      metadata: {
        scholarshipId,
        amount,
        ethAmount
      }
    }
    
    state.transactions.push(transaction)
    saveState(state)
    
    // Simulate confirmation after 2-3 seconds
    setTimeout(() => {
      const updatedState = getState()
      const tx = updatedState.transactions.find(t => t.hash === txHash)
      if (tx) {
        tx.status = 'confirmed'
        tx.blockNumber = updatedState.blockNumber++
        tx.gasUsed = '21000'
        tx.gasPrice = '20000000000' // 20 gwei
        
        // Update balances (simplified - just track that donation happened)
        if (!updatedState.balances[fromAddress]) {
          updatedState.balances[fromAddress] = ethToWei(10) // Give demo address 10 ETH
        }
        
        saveState(updatedState)
      }
    }, 2000 + Math.random() * 1000)
    
    return txHash
  },

  /**
   * Simulate scholarship creation transaction
   */
  async simulateScholarshipCreation(
    studentAddress: string,
    goalAmount: number // in INR
  ): Promise<string> {
    const state = getState()
    const txHash = generateTxHash()
    
    const ethAmount = goalAmount / 300000
    const weiAmount = ethToWei(ethAmount)
    
    const transaction: Transaction = {
      hash: txHash,
      from: studentAddress,
      value: '0', // Creation doesn't transfer ETH
      status: 'pending',
      timestamp: Date.now(),
      type: 'scholarship_creation',
      metadata: {
        studentAddress,
        goalAmount,
        ethAmount
      }
    }
    
    state.transactions.push(transaction)
    saveState(state)
    
    setTimeout(() => {
      const updatedState = getState()
      const tx = updatedState.transactions.find(t => t.hash === txHash)
      if (tx) {
        tx.status = 'confirmed'
        tx.blockNumber = updatedState.blockNumber++
        tx.gasUsed = '150000'
        tx.gasPrice = '20000000000'
        saveState(updatedState)
      }
    }, 2000 + Math.random() * 1000)
    
    return txHash
  },

  /**
   * Simulate proof submission transaction
   */
  async simulateProofSubmission(
    scholarshipId: string,
    milestoneIndex: number,
    studentAddress: string
  ): Promise<string> {
    const state = getState()
    const txHash = generateTxHash()
    const cid = generateCID()
    
    const transaction: Transaction = {
      hash: txHash,
      from: studentAddress,
      value: '0',
      status: 'pending',
      timestamp: Date.now(),
      type: 'proof_submission',
      metadata: {
        scholarshipId,
        milestoneIndex,
        cid
      }
    }
    
    state.transactions.push(transaction)
    saveState(state)
    
    setTimeout(() => {
      const updatedState = getState()
      const tx = updatedState.transactions.find(t => t.hash === txHash)
      if (tx) {
        tx.status = 'confirmed'
        tx.blockNumber = updatedState.blockNumber++
        tx.gasUsed = '100000'
        tx.gasPrice = '20000000000'
        saveState(updatedState)
      }
    }, 2000 + Math.random() * 1000)
    
    return txHash
  },

  /**
   * Simulate NFT minting
   */
  async simulateNFTMint(
    donorAddress: string,
    studentAddress: string,
    studentName: string,
    amount: number,
    type: 'donation' | 'achievement' = 'donation',
    milestoneId?: string,
    milestoneTitle?: string
  ): Promise<NFTMetadata> {
    const state = getState()
    const nftState = blockchainSimulator.getNFTs()
    
    const tokenId = state.nftCounter + 1
    state.nftCounter = tokenId
    
    const txHash = generateTxHash()
    
    // Generate NFT image URL (using placeholder service)
    const imageUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}&backgroundColor=b6e3f4`
    
    const nft: NFTMetadata = {
      tokenId,
      donorAddress,
      studentAddress,
      studentName,
      amount,
      milestoneId,
      milestoneTitle,
      type,
      imageUrl,
      description: type === 'donation' 
        ? `Donation of ₹${amount.toLocaleString()} to ${studentName}`
        : `Achievement badge for completing: ${milestoneTitle || 'Milestone'}`,
      mintedAt: new Date().toISOString(),
      transactionHash: txHash
    }
    
    nftState.push(nft)
    localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(nftState))
    
    // Also create transaction record
    const transaction: Transaction = {
      hash: txHash,
      from: donorAddress,
      value: '0',
      status: 'confirmed',
      timestamp: Date.now(),
      blockNumber: state.blockNumber++,
      gasUsed: '150000',
      gasPrice: '20000000000',
      type: 'nft_mint',
      metadata: {
        tokenId,
        nftType: type
      }
    }
    
    state.transactions.push(transaction)
    saveState(state)
    
    return nft
  },

  /**
   * Get transaction status
   */
  getTransactionStatus(txHash: string): Transaction | null {
    const state = getState()
    return state.transactions.find(t => t.hash === txHash) || null
  },

  /**
   * Get balance for an address (in ETH)
   */
  getBalance(address: string): number {
    const state = getState()
    const weiBalance = state.balances[address] || '0'
    return weiToEth(weiBalance)
  },

  /**
   * Get all transactions for an address
   */
  getTransactions(address: string): Transaction[] {
    const state = getState()
    return state.transactions.filter(
      t => t.from === address || t.to === address
    )
  },

  /**
   * Get all NFTs
   */
  getNFTs(): NFTMetadata[] {
    try {
      const stored = localStorage.getItem(NFT_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  /**
   * Get NFTs for a specific address
   */
  getNFTsForAddress(address: string): NFTMetadata[] {
    const nfts = blockchainSimulator.getNFTs()
    return nfts.filter(nft => 
      nft.donorAddress.toLowerCase() === address.toLowerCase() ||
      nft.studentAddress.toLowerCase() === address.toLowerCase()
    )
  },

  /**
   * Generate IPFS CID (for proof uploads)
   */
  generateCID,

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(txHash: string, timeout = 10000): Promise<Transaction> {
    const startTime = Date.now()
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const tx = blockchainSimulator.getTransactionStatus(txHash)
        
        if (tx?.status === 'confirmed') {
          clearInterval(checkInterval)
          resolve(tx)
        } else if (tx?.status === 'failed') {
          clearInterval(checkInterval)
          reject(new Error('Transaction failed'))
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval)
          reject(new Error('Transaction timeout'))
        }
      }, 500)
    })
  }
}

