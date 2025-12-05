import { ethers } from 'ethers'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { blockchainSimulator } from './blockchainSimulator'

// Check if we're in demo mode
const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return true
  const saved = window.localStorage.getItem('fundmeup-mode')
  return saved !== 'live' // Default to demo if not explicitly set to live
}

// Contract ABI - This would be imported from your deployed contract
const FUNDMEUP_ABI = [
  // Events
  "event ScholarshipCreated(uint256 indexed id, address indexed student, uint256 amount)",
  "event ScholarshipFunded(uint256 indexed id, address indexed donor, uint256 amount)",
  "event ProofSubmitted(uint256 indexed id, string cid, address indexed student)",
  "event ProofVerified(uint256 indexed id, bool verified)",
  "event NFTMinted(address indexed to, uint256 tokenId, string metadata)",
  "event ImpactTokensMinted(address indexed to, uint256 amount)",
  
  // Functions
  "function createScholarship(address student) external returns (uint256)",
  "function fundScholarship(uint256 id) external payable",
  "function submitProof(uint256 id, string cid) external",
  "function verifyProof(uint256 id) external",
  "function releaseFunds(uint256 id) external",
  "function mintNFT(address to, string metadata) external",
  "function mintImpactTokens(address to, uint256 amount) external",
  "function getScholarship(uint256 id) external view returns (tuple(address student, uint256 amount, uint256 funded, bool verified, string cid))",
  "function getStudentScholarships(address student) external view returns (uint256[])",
  "function getDonorScholarships(address donor) external view returns (uint256[])",
]

// Contract address - This would be your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

// Web3 service class
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null
  private isSimulated: boolean = false

  async initialize() {
    this.isSimulated = isDemoMode()
    
    if (this.isSimulated) {
      console.log('🔷 Web3 Service: Using blockchain simulator (Demo Mode)')
      return
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, FUNDMEUP_ABI, this.signer)
    }
  }

  async createScholarship(studentAddress: string, goalAmount?: number) {
    if (this.isSimulated) {
      const txHash = await blockchainSimulator.simulateScholarshipCreation(
        studentAddress,
        goalAmount || 0
      )
      // Wait for confirmation
      await blockchainSimulator.waitForConfirmation(txHash)
      return {
        hash: txHash,
        wait: async () => blockchainSimulator.waitForConfirmation(txHash)
      }
    }
    
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.createScholarship(studentAddress)
    return await tx.wait()
  }

  async fundScholarship(scholarshipId: number | string, amount: string | number, fromAddress?: string) {
    if (this.isSimulated) {
      const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount
      const address = fromAddress || '0xDemoDonor'
      const txHash = await blockchainSimulator.simulateDonation(
        String(scholarshipId),
        amountNum,
        address
      )
      await blockchainSimulator.waitForConfirmation(txHash)
      return {
        hash: txHash,
        wait: async () => blockchainSimulator.waitForConfirmation(txHash)
      }
    }
    
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.fundScholarship(scholarshipId, {
      value: ethers.parseEther(String(amount))
    })
    return await tx.wait()
  }

  async submitProof(scholarshipId: number | string, cid: string, studentAddress?: string) {
    if (this.isSimulated) {
      const address = studentAddress || '0xDemoStudent'
      const txHash = await blockchainSimulator.simulateProofSubmission(
        String(scholarshipId),
        0, // milestoneIndex
        address
      )
      await blockchainSimulator.waitForConfirmation(txHash)
      return {
        hash: txHash,
        wait: async () => blockchainSimulator.waitForConfirmation(txHash)
      }
    }
    
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.submitProof(scholarshipId, cid)
    return await tx.wait()
  }

  async verifyProof(scholarshipId: number) {
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.verifyProof(scholarshipId)
    return await tx.wait()
  }

  async releaseFunds(scholarshipId: number) {
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.releaseFunds(scholarshipId)
    return await tx.wait()
  }

  async mintNFT(to: string, metadata: string) {
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.mintNFT(to, metadata)
    return await tx.wait()
  }

  async mintImpactTokens(to: string, amount: string) {
    if (!this.contract) throw new Error('Contract not initialized')
    const tx = await this.contract.mintImpactTokens(to, amount)
    return await tx.wait()
  }

  async getScholarship(id: number) {
    if (!this.contract) throw new Error('Contract not initialized')
    return await this.contract.getScholarship(id)
  }

  async getStudentScholarships(studentAddress: string) {
    if (!this.contract) throw new Error('Contract not initialized')
    return await this.contract.getStudentScholarships(studentAddress)
  }

  async getDonorScholarships(donorAddress: string) {
    if (!this.contract) throw new Error('Contract not initialized')
    return await this.contract.getDonorScholarships(donorAddress)
  }

  // Event listeners
  onScholarshipCreated(callback: (id: number, student: string, amount: string) => void) {
    if (!this.contract) return
    this.contract.on('ScholarshipCreated', callback)
  }

  onScholarshipFunded(callback: (id: number, donor: string, amount: string) => void) {
    if (!this.contract) return
    this.contract.on('ScholarshipFunded', callback)
  }

  onProofSubmitted(callback: (id: number, cid: string, student: string) => void) {
    if (!this.contract) return
    this.contract.on('ProofSubmitted', callback)
  }

  onProofVerified(callback: (id: number, verified: boolean) => void) {
    if (!this.contract) return
    this.contract.on('ProofVerified', callback)
  }

  onNFTMinted(callback: (to: string, tokenId: number, metadata: string) => void) {
    if (!this.contract) return
    this.contract.on('NFTMinted', callback)
  }

  onImpactTokensMinted(callback: (to: string, amount: string) => void) {
    if (!this.contract) return
    this.contract.on('ImpactTokensMinted', callback)
  }

  // Utility functions
  formatEther(wei: string) {
    return ethers.formatEther(wei)
  }

  parseEther(ether: string) {
    return ethers.parseEther(ether)
  }

  async getBalance(address: string) {
    if (this.isSimulated) {
      return blockchainSimulator.getBalance(address)
    }
    
    if (!this.provider) throw new Error('Provider not initialized')
    const balance = await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }
  
  getIsSimulated(): boolean {
    return this.isSimulated
  }

  async getNetwork() {
    if (!this.provider) throw new Error('Provider not initialized')
    return await this.provider.getNetwork()
  }
}

// Create singleton instance
export const web3Service = new Web3Service()

// Wagmi hooks for React components
export const useWeb3 = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  return {
    address,
    isConnected,
    connect,
    connectors,
    disconnect,
    signMessage: signMessageAsync,
  }
}

export default web3Service

