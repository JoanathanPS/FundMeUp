/**
 * Ethers V2 service for FundMeUp V2 contract interactions
 * This service handles enhanced blockchain features like impact tokens
 */

let provider = null;
let contract = null;

/**
 * Initialize Ethers V2 service
 */
async function initialize() {
  try {
    // Import ethers dynamically to avoid breaking if not configured
    const { ethers } = require('ethers');
    
    // Check if RPC URL is configured
    if (!process.env.RPC_URL) {
      console.log('⚠️  V2 RPC_URL not configured. V2 features will be disabled.');
      return { success: false, message: 'RPC URL not configured' };
    }

    // Check if V2 contract address is configured
    if (!process.env.V2_CONTRACT_ADDRESS) {
      console.log('⚠️  V2_CONTRACT_ADDRESS not configured. V2 contract interactions will be disabled.');
      return { success: false, message: 'V2 contract address not configured' };
    }

    // Initialize provider
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    console.log('✓ Ethers V2 service initialized successfully');
    return { success: true, message: 'Ethers V2 service initialized' };
  } catch (error) {
    console.error('Error initializing Ethers V2 service:', error.message);
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
 * Check if Ethers V2 is initialized
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
