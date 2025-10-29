/**
 * Fee Calculation Utility for Web3 Donations
 * Calculates platform fees, gas estimates, and total costs
 */

export interface FeeBreakdown {
  donationAmount: number
  gasFee: number
  platformFee: number
  reservePoolFee: number
  convenienceFee: number
  studentReceives: number
  totalCost: number
  platformFeePercent: number
  reservePoolPercent: number
}

export interface GasEstimate {
  gasPrice: string // in gwei
  gasLimit: string
  estimatedCost: number // in ETH
  estimatedCostINR: number
}

/**
 * Calculate all fees for a donation
 */
export const calculateDonationFees = (
  donationAmount: number,
  ethPriceINR: number,
  gasEstimate: GasEstimate,
  convenienceFee: number = 0
): FeeBreakdown => {
  const PLATFORM_FEE_PERCENT = 5 // 5%
  const RESERVE_POOL_PERCENT = 2 // 2%
  
  const platformFee = (donationAmount * PLATFORM_FEE_PERCENT) / 100
  const reservePoolFee = (donationAmount * RESERVE_POOL_PERCENT) / 100
  
  // Convert gas to INR
  const gasFeeINR = gasEstimate.estimatedCostINR
  
  // Total fees
  const totalFees = platformFee + reservePoolFee + gasFeeINR + convenienceFee
  
  // Student receives the donation minus platform and reserve fees
  const studentReceives = donationAmount - platformFee - reservePoolFee
  
  // Total cost to donor (donation + gas + convenience fee)
  const totalCost = donationAmount + gasFeeINR + convenienceFee
  
  return {
    donationAmount,
    gasFee: gasFeeINR,
    platformFee,
    reservePoolFee,
    convenienceFee,
    studentReceives,
    totalCost,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    reservePoolPercent: RESERVE_POOL_PERCENT
  }
}

/**
 * Estimate gas for a transaction
 */
export const estimateGas = async (
  provider: any,
  from: string,
  to: string,
  value: string,
  data: string
): Promise<GasEstimate> => {
  try {
    // Estimate gas limit
    const gasLimit = await provider.estimateGas({
      from,
      to,
      value,
      data
    })
    
    // Get current gas price
    const gasPrice = await provider.getGasPrice()
    
    // Calculate cost in ETH
    const estimatedCost = parseFloat(gasLimit.toString()) * parseFloat(gasPrice.toString()) / 1e18
    
    // Get ETH price for INR conversion
    const ethPrice = await fetchETHPriceINR()
    
    return {
      gasPrice: (parseFloat(gasPrice.toString()) / 1e9).toString(), // Convert to gwei
      gasLimit: gasLimit.toString(),
      estimatedCost,
      estimatedCostINR: estimatedCost * ethPrice
    }
  } catch (error) {
    console.error('Gas estimation failed:', error)
    // Return default estimates
    return {
      gasPrice: '20',
      gasLimit: '21000',
      estimatedCost: 0.00042,
      estimatedCostINR: 10
    }
  }
}

/**
 * Fetch current ETH price in INR
 */
export const fetchETHPriceINR = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
    const data = await response.json()
    return data.ethereum?.inr || 0
  } catch (error) {
    console.error('Failed to fetch ETH price:', error)
    return 350000 // Default fallback
  }
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

