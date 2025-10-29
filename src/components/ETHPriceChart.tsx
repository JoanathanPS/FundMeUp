import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Loader2, RefreshCw } from 'lucide-react'

interface ETHPriceData {
  timestamp: number
  price: number
  date: string
}

const ETHPriceChart: React.FC = () => {
  const [livePrice, setLivePrice] = useState<number>(0)
  const [historicalData, setHistoricalData] = useState<ETHPriceData[]>([])
  const [change30Days, setChange30Days] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  // Lazy loading with Intersection Observer
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "200px" })
  
  // Debounce function
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }, [])

  // Fetch live ETH price
  const fetchLivePrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
      const data = await response.json()
      
      if (data.ethereum && data.ethereum.inr) {
        setLivePrice(data.ethereum.inr)
      }
    } catch (err) {
      console.error('Error fetching live price:', err)
      setError('Failed to fetch live price')
    }
  }

  // Fetch historical price data
  const fetchHistoricalData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=inr&days=30')
      const data = await response.json()
      
      if (data.prices && data.prices.length > 0) {
        // Reduce data points for better performance (every 3rd point)
        const reducedData = data.prices.filter((_: any, index: number) => index % 3 === 0)
        
        const formattedData: ETHPriceData[] = reducedData.map((item: [number, number]) => {
          const timestamp = item[0]
          const price = item[1]
          const date = new Date(timestamp)
          
          return {
            timestamp,
            price: Math.round(price),
            date: `${date.getDate()}/${date.getMonth() + 1}`
          }
        })
        
        setHistoricalData(formattedData)
        
        // Calculate 30-day change
        if (formattedData.length > 1) {
          const firstPrice = formattedData[0].price
          const lastPrice = formattedData[formattedData.length - 1].price
          const change = ((lastPrice - firstPrice) / firstPrice) * 100
          setChange30Days(change)
        }
      }
    } catch (err) {
      console.error('Error fetching historical data:', err)
      setError('Failed to fetch historical data')
      // Set mock data for demo
      setHistoricalData([])
      setLivePrice(350000)
    } finally {
      setIsLoading(false)
    }
  }

  // Only load data when component is in view
  useEffect(() => {
    if (isInView) {
      fetchLivePrice()
      fetchHistoricalData()
      
      // Refresh price every 120 seconds (reduced from 60s for better performance)
      const priceInterval = setInterval(fetchLivePrice, 120000)
      
      return () => clearInterval(priceInterval)
    }
  }, [isInView])

  const refreshData = async () => {
    setLastUpdated(new Date())
    await fetchLivePrice()
    await fetchHistoricalData()
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {payload[0].payload.date}
          </p>
          <p className="text-lg font-bold text-orange-600">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div ref={ref}>
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              ETH Price Tracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Live Ethereum Price in Indian Rupees
            </p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Refresh data"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Current Price Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current ETH Price
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{livePrice.toLocaleString('en-IN')}
            </p>
          </div>
          {change30Days !== 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                30-Day Change
              </p>
              <div className={`flex items-center space-x-1 ${change30Days >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change30Days >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-2xl font-bold">
                  {change30Days >= 0 ? '+' : ''}{change30Days.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading chart data...</span>
        </div>
      ) : error || historicalData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Unable to load chart data</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {error || 'Please check your connection'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            ETH to INR – Last 30 Days Trend
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Educational Footer */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          💡 <strong>Why donate in ETH?</strong> Donating in Ethereum is not just transparent and secure, 
          it can be financially smart for large donors. ETH donations offer blockchain transparency, 
          long-term value potential, and easier tax reporting.
        </p>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
      </p>
        </motion.div>
      ) : (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
      )}
    </div>
  )
}

export default ETHPriceChart

