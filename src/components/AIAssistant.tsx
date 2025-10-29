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
  Award
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  type?: 'student' | 'donor' | 'admin' | 'general'
}

const AIAssistant: React.FC<AIAssistantProps> = ({ type = 'general' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    if (messages.length === 0) {
      setMessages(welcomeMessages[type].map((msg, idx) => ({
        id: `welcome-${idx}`,
        ...msg,
        timestamp: new Date()
      })))
    }
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
    if (!input.trim() || isLoading) return

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
      const response = generateAIResponse(input, type)
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
        return "To apply successfully:\n1. ✅ Complete your profile with accurate information\n2. 📧 Verify your academic email\n3. 🎯 Add at least 3 clear, achievable milestones\n4. 📸 Upload your profile photo\n5. 💬 Write a compelling bio\n\nI can help you with any of these steps. What would you like to work on?"
      }
    }

    // Donor context responses
    if (context === 'donor') {
      if (lowerInput.includes('donation') || lowerInput.includes('impact')) {
        return "Your donation impact:\n\n💰 **Total Donated:** ₹125,000\n👥 **Students Helped:** 15\n🏆 **Milestones Completed:** 42\n🌟 **Your Impact Score:** 8.5/10\n\nTop causes you support: Computer Science, Biotechnology\n\nWould you like detailed breakdowns or to explore new opportunities?"
      }
      if (lowerInput.includes('find') || lowerInput.includes('search')) {
        return "I can help you find students! Consider:\n\n🔍 **By Field:** Engineering, Medicine, Arts, etc.\n📍 **By Region:** Specific states or countries\n🎯 **By Goal:** Career aspirations\n💡 **By Urgency:** Students close to milestones\n\nWhat criteria matter most to you?"
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
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
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

