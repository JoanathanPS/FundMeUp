/**
 * Ethers service for blockchain interactions
 * This service handles smart contract interactions for FundMeUp
 */

let provider = null;
let contract = null;

/**
 * Initialize Ethers service
 */
async function initialize() {
  try {
    // Import ethers dynamically to avoid breaking if not configured
    const { ethers } = require('ethers');
    
    // Check if RPC URL is configured
    if (!process.env.RPC_URL) {
      console.log('⚠️  RPC_URL not configured. Blockchain features will be disabled.');
      return { success: false, message: 'RPC URL not configured' };
    }

    // Check if contract address is configured
    if (!process.env.CONTRACT_ADDRESS) {
      console.log('⚠️  CONTRACT_ADDRESS not configured. Contract interactions will be disabled.');
      return { success: false, message: 'Contract address not configured' };
    }

    // Initialize provider
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    console.log('✓ Ethers service initialized successfully');
    return { success: true, message: 'Ethers service initialized' };
  } catch (error) {
    console.error('Error initializing Ethers service:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Get provider instance
 */
function getProvider() {
  return provider;
}

/**
 * Get contract instance
 */
function getContract() {
  return contract;
}

/**
 * Check if Ethers is initialized
 */
function isInitialized() {
  return provider !== null;
}

module.exports = {
  initialize,
  getProvider,
  getContract,
  isInitialized
};
