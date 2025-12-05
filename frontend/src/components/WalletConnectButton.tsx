import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDisconnect } from 'wagmi'

const WalletConnectButton = () => {
  const [copied, setCopied] = useState(false)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
  const { disconnect } = useDisconnect()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openConnectModal}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 text-sm"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </motion.button>
                )
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openChainModal}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <span>Wrong Network</span>
                  </motion.button>
                )
              }

              return (
                <div className="flex items-center gap-1.5 xl:gap-2">
                  {/* Connected Status - Simple Ethereum Logo + Connected */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(account.address)
                    }}
                    onMouseEnter={() => setHoveredAddress(account.address)}
                    onMouseLeave={() => setHoveredAddress(null)}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-md group whitespace-nowrap"
                    title={`Connected: ${account.address} (Click to copy)`}
                  >
                    {chain.hasIcon && (
                      <div className="flex items-center justify-center">
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                    )}
                    <span className="text-xs xl:text-sm font-semibold">Connected</span>
                    {copied && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-3.5 w-3.5 flex-shrink-0" />
                      </motion.div>
                    )}
                    
                    {/* Tooltip with full address */}
                    {hoveredAddress && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-50"
                      >
                        {account.address}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Logout Button - Compact */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      try {
                        await disconnect()
                        const keysToRemove: string[] = []
                        for (let i = 0; i < localStorage.length; i++) {
                          const key = localStorage.key(i)
                          if (key && (key.includes('wagmi') || key.includes('wallet') || key.includes('rainbow'))) {
                            keysToRemove.push(key)
                          }
                        }
                        keysToRemove.forEach(key => localStorage.removeItem(key))
                        toast.success('Wallet disconnected!')
                        setTimeout(() => window.location.reload(), 500)
                      } catch (error) {
                        console.error('Disconnect error:', error)
                        toast.error('Error disconnecting')
                        setTimeout(() => window.location.reload(), 500)
                      }
                    }}
                    className="px-2.5 xl:px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="hidden lg:inline text-xs xl:text-sm font-semibold">Logout</span>
                  </motion.button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default WalletConnectButton


