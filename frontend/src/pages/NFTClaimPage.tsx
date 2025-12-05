import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, CheckCircle, Download, Share2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const NFTClaimPage = () => {
  const [claiming, setClaiming] = useState(false)
  const [claimedNFTs, setClaimedNFTs] = useState<any[]>([])

  const availableNFTs = [
    {
      id: '1',
      name: 'Impact Pioneer',
      description: 'Donated to your first student',
      rarity: 'Common',
      image: '/api/placeholder/200/200',
      claimed: false
    },
    {
      id: '2',
      name: 'Change Maker',
      description: 'Donated over ₹10,000 total',
      rarity: 'Rare',
      image: '/api/placeholder/200/200',
      claimed: false
    },
    {
      id: '3',
      name: 'Dream Supporter',
      description: 'Supported 5+ students',
      rarity: 'Epic',
      image: '/api/placeholder/200/200',
      claimed: false
    },
  ]

  const handleClaim = async (nft: any) => {
    setClaiming(true)
    // Simulate blockchain claim
    setTimeout(() => {
      toast.success(`🎉 ${nft.name} NFT claimed successfully!`)
      setClaimedNFTs([...claimedNFTs, nft])
      setClaiming(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Gift className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Claim Your NFT Badges
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mint verifiable NFT badges to celebrate your impact as a donor
          </p>
        </motion.div>

        {/* Available NFTs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative">
                <img src={nft.image} alt={nft.name} className="w-full h-64 object-cover" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    nft.rarity === 'Common' ? 'bg-gray-100 text-gray-800' :
                    nft.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {nft.rarity}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {nft.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {nft.description}
                </p>
                
                <button
                  onClick={() => handleClaim(nft)}
                  disabled={claiming}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {claiming ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <span>Claiming...</span>
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5" />
                      <span>Claim NFT</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Claimed NFTs */}
        {claimedNFTs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your NFT Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedNFTs.map((nft) => (
                <div key={nft.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-green-500">
                  <div className="relative">
                    <img src={nft.image} alt={nft.name} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {nft.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <button className="btn-outline flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button className="btn-outline flex items-center space-x-2">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default NFTClaimPage

