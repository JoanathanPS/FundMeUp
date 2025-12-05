import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Network {
  id: string
  name: string
  icon: any
  connected: boolean
  comingSoon?: boolean
}

const NetworkSwitcher = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum')
  
  const networks: Network[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: Coins,
      connected: true,
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: Coins,
      connected: false,
      comingSoon: true,
    },
  ]

  const handleNetworkSwitch = (networkId: string, network: Network) => {
    if (network.comingSoon) {
      toast.error('Bitcoin network coming soon!')
      return
    }

    if (networkId === selectedNetwork) {
      toast.info('Already connected to Ethereum network')
      return
    }

    setSelectedNetwork(networkId)
    toast.success(`Switched to ${network.name} network`)
  }

  const getEthereumIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 17.97L4.58 13.62L11.943 24L19.308 13.62L11.944 17.97Z" fill="#627EEA"/>
      <path d="M11.944 0L4.58 12.22L11.944 17.97L19.311 12.22L11.944 0Z" fill="#627EEA"/>
      <path d="M4.58 14.37L11.944 19.12L19.308 14.37L11.944 24L4.58 14.37Z" fill="#C6B3F9"/>
    </svg>
  )

  const getBitcoinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#F7931A"/>
      <path d="M15.6 9.8c.2-1.3-.8-2-2.2-2.4l.4-1.8-1.1-.3-.4 1.7c-.3-.1-.6-.2-.9-.3l.4-1.7-1.1-.3-.4 1.8c-.2-.1-.5-.1-.8-.2l0-.1-1.5-.4-.3 1.2s.8.2.8.2c.5.1.6.2.6.5l-.6 2.6c0 .1-.1.1-.2.1l-.3-.1c0 0-1.1-.3-1.2-.3 0 0-.8.4-.6 1.1s.8 1 1 1.2l-.4 1.6c-.1.2-.3.3-.5.3l-.4.1h-.1c0 .1-.2.1-.2.1s-.9.4-.7 1.2c.1.7 1 1.3 1.2 1.5l-.1.3c-.1.4-.4.4-.7.4h-.1c0 0-.6-.1-.7-.1-.4-.1-.7-.3-.7-.9 0-.9 1-1.2 1.2-1.3.1-.1.1-.1.1-.1l-.7-2.9c-.1-.3-.3-.4-.6-.5l-.2-.1s1.1.3 1.2.3c.1-.1.1-.2.2-.3l-.8-3.5c0-.4-.3-.5-.7-.6-.2-.1-1-.3-1-.3s.4-1.7.4-1.8.3-.1.6-.2l2.6.7c.2 0 .4 0 .5.1l-.4 1.8c.3 0 .6.1.9.2l.4-1.8c.1 0 .3 0 .5-.1l2.6-.7c.3-.1.6-.2.6-.2s-.4 1.7-.4 1.8c0 .1.2.1.3.2h-.1zM11.8 11.5l-.8 3.4c.3 0 .6-.1.9-.2l.8-3.4c-.3-.1-.6-.1-.9.2zm-2.6-3.1l-.9 3.9c.3 0 .6-.1.9-.2l.9-3.9c-.3-.1-.6-.1-.9.2z" fill="white"/>
    </svg>
  )

  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {networks.map((network) => {
        const isSelected = selectedNetwork === network.id
        const isDisabled = network.comingSoon
        
        return (
          <motion.button
            key={network.id}
            onClick={() => handleNetworkSwitch(network.id, network)}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className={`
              relative flex items-center justify-center space-x-2 px-4 py-2 rounded-lg 
              transition-all duration-200 ease-in-out
              ${isSelected 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Network Icon */}
            <div className="flex items-center justify-center">
              {network.id === 'ethereum' ? getEthereumIcon() : getBitcoinIcon()}
            </div>
            
            {/* Network Name */}
            <span className="text-sm font-medium">
              {network.name}
            </span>
            
            {/* Status Indicator */}
            {network.id === 'ethereum' && (
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-xs">Connected</span>
              </div>
            )}
            
            {network.comingSoon && (
              <div className="flex items-center space-x-1 ml-1">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs">Soon</span>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default NetworkSwitcher

