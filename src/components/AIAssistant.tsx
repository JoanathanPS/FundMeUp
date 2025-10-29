import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Loader2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Award,
  GraduationCap,
  Heart,
  HelpCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

type UserType = 'student' | 'donor' | 'none'

interface AIAssistantProps {
  type?: 'student' | 'donor' | 'admin' | 'general'
  autoDetectUserType?: boolean
}

const AIAssistant: React.FC<AIAssistantProps> = ({ type = 'general', autoDetectUserType = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<UserType>('none')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const welcomeMessages = {
    student: [
      {
        role: 'assistant' as const,
        content: "👋 Hi! I'm your AI scholarship assistant. I can help you:\n• Draft compelling bios and profiles\n• Summarize your milestones and achievements\n• Suggest improvements for your applications\n• Answer questions about the funding process"
      }
    ],
    donor: [
      {
        role: 'assistant' as const,
        content: "👋 Hello! I'm your AI donor assistant. I can help you:\n• Analyze your donation history and impact\n• Find students matching your interests\n• Understand platform trends and statistics\n• Get real-time feedback on your contributions"
      }
    ],
    admin: [
      {
        role: 'assistant' as const,
        content: "👋 Welcome, Admin! I'm your AI moderation assistant. I can help you:\n• Review and analyze new applications\n• Detect fraud or suspicious patterns\n• Generate insights from platform data\n• Make recommendations for approvals"
      }
    ],
    general: [
      {
        role: 'assistant' as const,
        content: "👋 Hello! I'm FundMeUp's AI assistant. How can I help you today?"
      }
    ]
  }

  const handleOpen = () => {
    setIsOpen(true)
    
    // Auto-detect user type from current page
    if (autoDetectUserType) {
      const path = window.location.pathname
      if (path.includes('/student')) {
        setUserType('student')
      } else if (path.includes('/donor')) {
        setUserType('donor')
      }
    }
    
    if (messages.length === 0 && userType !== 'none') {
      const contextType = userType === 'student' ? 'student' : userType === 'donor' ? 'donor' : type
      setMessages(welcomeMessages[contextType].map((msg, idx) => ({
        id: `welcome-${idx}`,
        ...msg,
        timestamp: new Date()
      })))
    }
  }

  const handleSelectUserType = (selectedType: 'student' | 'donor') => {
    setUserType(selectedType)
    setMessages(welcomeMessages[selectedType].map((msg, idx) => ({
      id: `welcome-${idx}`,
      ...msg,
      timestamp: new Date()
    })))
  }

  const simulateTyping = (text: string, callback: (fullText: string) => void) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || userType === 'none') return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      // Use selected userType or fallback to type prop
      const contextType = userType !== 'none' ? userType : type
      const response = generateAIResponse(input, contextType)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      simulateTyping(response, (text) => {
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage.role === 'assistant') {
            lastMessage.content = text
          }
          return updated
        })
      })

      setIsLoading(false)
    }, 500)
  }

  const generateAIResponse = (userInput: string, context: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    // Student context responses
    if (context === 'student' || context === 'general') {
      if (lowerInput.includes('bio') || lowerInput.includes('profile')) {
        return "I'd be happy to help you craft a compelling bio! Here's a template:\n\n🎯 **Introduction:** Share your passion and background (1-2 sentences)\n📚 **Education:** Your field of study, year, and institution\n💡 **Goals:** What you aim to achieve with the scholarship\n🌟 **Why You:** What makes you unique and deserving\n\nWould you like me to personalize this based on your information?"
      }
      if (lowerInput.includes('milestone')) {
        return "Great question! Effective milestones should:\n✓ Be specific and measurable\n✓ Include clear deadlines\n✓ Demonstrate progress toward your goal\n✓ Be verifiable (e.g., completed coursework, certificates)\n\nExample: 'Complete Advanced Quantum Computing course with A+ grade by March 2024'\n\nShare your milestones and I'll help refine them!"
      }
      if (lowerInput.includes('apply') || lowerInput.includes('application')) {
        return "To apply successfully:\n1. ✅ Complete your profile with accurate information\n2. 📧 Verify your academic email (e.g., your.email@saveetha.com)\n3. 🎯 Add at least 3 clear, achievable milestones\n4. 📸 Upload your profile photo\n5. 💬 Write a compelling bio\n\nI can help you with any of these steps. What would you like to work on?"
      }
      if (lowerInput.includes('email') || lowerInput.includes('verify') || lowerInput.includes('verification')) {
        return "📧 Email Verification Guide:\n\n1. Use your official college email (e.g., 192472229.simats@saveetha.com)\n2. Click 'Verify Email' in your student dashboard\n3. Enter your student name and institution\n4. Check your inbox for OTP code\n5. Enter the 6-digit code to complete verification\n\nSupported domains: saveetha.com, vit.ac.in, iit.ac.in, and more\n\nHaving trouble? I can help troubleshoot!"
      }
      if (lowerInput.includes('milestone upload') || lowerInput.includes('document')) {
        return "📄 Milestone Upload Steps:\n\n1. Click 'Submit Proof' in your dashboard\n2. Select the milestone you completed\n3. Upload your document (certificate, transcript, etc.)\n4. Add a description of your achievement\n5. Submit and wait for AI verification\n\nTip: Make sure documents are clear and readable. AI verifies authenticity automatically!"
      }
      if (lowerInput.includes('region') || lowerInput.includes('kerala') || lowerInput.includes('institution')) {
        return "🏛️ Institution Verification:\n\nYour institution is automatically verified against regional databases. If not found:\n\n1. Check that your institution name is spelled correctly\n2. Contact support if your school is missing\n3. The system supports major institutions in India\n4. You can still apply even if not in the database\n\nNeed help? Let me know your institution name!"
      }
      if (lowerInput.includes('error') || lowerInput.includes('problem') || lowerInput.includes('issue')) {
        return "🔧 Troubleshooting Guide:\n\nCommon issues and solutions:\n\n• Email not verified? Use @saveetha.com domain\n• Application rejected? Check AI feedback and improve documents\n• Milestone pending? Wait for AI review (usually 24-48 hours)\n• Can't upload? Ensure file is PDF, JPG, or PNG under 10MB\n\nTell me your specific issue and I'll help resolve it!"
      }
    }

    // Donor context responses
    if (context === 'donor') {
      if (lowerInput.includes('donation') || lowerInput.includes('impact')) {
        return "Your donation impact:\n\n💰 **Total Donated:** ₹125,000\n👥 **Students Helped:** 15\n🏆 **Milestones Completed:** 42\n🌟 **Your Impact Score:** 8.5/10\n\nTop causes you support: Computer Science, Biotechnology\n\nWould you like detailed breakdowns or to explore new opportunities?"
      }
      if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('student')) {
        return "I can help you find students to support! Here's how:\n\n🔍 **Browse by:**\n• Field of study (Engineering, Medicine, Arts)\n• Region/Country (India, International)\n• Career goals and aspirations\n• Urgency (near completion, just starting)\n• Milestone progress\n\n💰 **Filter by funding amount** to match your budget\n\nClick on any student card to see their full profile and milestones!"
      }
      if (lowerInput.includes('eth') || lowerInput.includes('ethereum') || lowerInput.includes('bitcoin') || lowerInput.includes('crypto')) {
        return "💰 Crypto Donations & Conversion:\n\n📊 **Current Rates:**\n• ETH: ~₹3,50,000\n• BTC: ~₹58,00,000\n\n🔄 **How It Works:**\n1. Connect your wallet (MetaMask, WalletConnect)\n2. Choose a student and donation amount (₹)\n3. Pay in ETH, BTC, or stablecoins\n4. Receive automatic NFT proof of donation\n\n💡 **Benefits:**\n✓ Tax deductions on donations\n✓ Transparency on blockchain\n✓ NFT badges for each donation\n\nWant to donate now? I can guide you through it!"
      }
      if (lowerInput.includes('nft') || lowerInput.includes('badge') || lowerInput.includes('proof')) {
        return "🎁 NFT Donation Badges:\n\nFor every donation ≥₹500, you'll receive:\n\n✨ **Unique NFT Badge** with:\n• Student's name and achievement\n• Your donation amount\n• Milestone funded\n• Timestamp on blockchain\n• Progress percentage\n\n📁 **Collect Your NFTs:**\n• View in your wallet\n• Share on social media\n• Track your impact\n• Use for tax reporting\n\n🔒 **On-chain forever** - verifiable proof of your contribution!\n\nWant to see your NFT collection?"
      }
      if (lowerInput.includes('tax') || lowerInput.includes('deduction')) {
        return "📋 Tax Benefits of Donations:\n\n✓ **Eligible for deductions** under Section 80G\n✓ **Crypto donations accepted** - use ETH/BTC directly\n✓ **NFT receipts** provide blockchain-proof documentation\n✓ **Automatic reporting** - we generate tax statements\n✓ **Scholarship funds** are 100% charitable\n\n💼 **For Business Donors:**\n• CSR compliance documentation\n• Impact reports for stakeholders\n• ESG scoring benefits\n\nNeed a tax statement? Contact our finance team!"
      }
      if (lowerInput.includes('fee') || lowerInput.includes('how much')) {
        return "💰 Fee Breakdown:\n\nWhen you donate ₹1,000:\n\n✅ **Student Receives:** ₹930 (93%)\n📊 **Platform Fee:** ₹50 (5%)\n💼 **Reserve Pool:** ₹20 (2%)\n\n➕ **Optional NFT Fee:** ₹25 (one-time)\n\n💡 **Platform fees** support:\n• AI verification system\n• Security and infrastructure\n• Student support services\n• Platform development\n\n100% transparent - see breakdown before donating!"
      }
    }

    // Admin context responses
    if (context === 'admin') {
      if (lowerInput.includes('review') || lowerInput.includes('application')) {
        return "New applications to review:\n\n⚠️ **Pending:** 23 applications\n✅ **Reviewed Today:** 15\n🚩 **Flagged:** 3 (requires attention)\n\nAI Risk Scores:\n• Low: 12 applications\n• Medium: 8 applications\n• High: 3 applications\n\nStart with the flagged items for fraud patterns."
      }
      if (lowerInput.includes('fraud') || lowerInput.includes('suspicious')) {
        return "Fraud Detection Summary:\n\n🔍 **AI Analysis:**\n• Document tampering: 2 cases\n• Suspicious email patterns: 1 case\n• Duplicate profiles: 0 cases\n\n🎯 **Recommendations:**\n1. Manual review required for 3 flagged items\n2. Request additional documentation\n3. Verify institutional credentials\n\nWould you like details on specific cases?"
      }
    }

    // General responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm here to help. What can I assist you with today?"
    }
    if (lowerInput.includes('help')) {
      return "I can help with many things:\n• Answering questions about FundMeUp\n• Guiding you through the platform\n• Analyzing data and trends\n• Providing personalized recommendations\n\nWhat would you like to know?"
    }

    return "Thanks for your message! I'm processing your request. Can you provide more details or rephrase your question?"
  }

  const quickActions = {
    student: [
      { text: "Help me write my bio", icon: "✍️" },
      { text: "Review my milestones", icon: "🎯" },
      { text: "What makes a good application?", icon: "💡" }
    ],
    donor: [
      { text: "Show my donation impact", icon: "📊" },
      { text: "Find new students to support", icon: "🔍" },
      { text: "Platform trends and insights", icon: "📈" }
    ],
    admin: [
      { text: "Review pending applications", icon: "📋" },
      { text: "Show fraud detection results", icon: "🚨" },
      { text: "Generate platform insights", icon: "🧠" }
    ],
    general: [
      { text: "How does FundMeUp work?", icon: "❓" },
      { text: "Tell me about the platform", icon: "ℹ️" }
    ]
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* User Type Selection (if not selected yet) */}
              {userType === 'none' && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <HelpCircle className="h-12 w-12 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Who are you?
                  </h3>
                  <div className="flex flex-col space-y-3 w-full">
                    <button
                      onClick={() => handleSelectUserType('student')}
                      className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          I'm a Student
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Get help with applications, verification, and milestones
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleSelectUserType('donor')}
                      className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-200 dark:border-green-800"
                    >
                      <Heart className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          I'm a Donor
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Learn about donations, NFTs, and impact
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.content.split('\n').map((line, idx) => (
                      <p key={idx} className="text-sm whitespace-pre-wrap">
                        {line}
                      </p>
                    ))}
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions[type].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(action.text)}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      {action.icon} {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={userType === 'none' ? 'Select user type first...' : 'Type your message...'}
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  disabled={isLoading || userType === 'none'}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading || userType === 'none'}
                  className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistant

