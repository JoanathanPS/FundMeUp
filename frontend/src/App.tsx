import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Pages
import Home from './pages/Home'
import StudentDashboard from './pages/StudentDashboard'
import SubmitProof from './pages/SubmitProof'
import StudentVerification from './pages/StudentVerification'
import DonorDashboard from './pages/DonorDashboard'
import ImpactFeed from './pages/ImpactFeed'
import Leaderboard from './pages/Leaderboard'
import Analytics from './pages/Analytics'
import AIDemo from './pages/AIDemo'
import VerificationDemo from './pages/VerificationDemo'
import ApplyPage from './pages/ApplyPage'
import DonatePage from './pages/DonatePage'
import ImpactPage from './pages/ImpactPage'
import NFTClaimPage from './pages/NFTClaimPage'
import MyDonations from './pages/MyDonations'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AIAssistant from './components/AIAssistant'
import MouseGlow from './components/MouseGradient'
import { useAppMode } from './context/AppModeContext'
import { useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDemo, toggleMode } = useAppMode()

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Mouse Glow Effect - behind everything */}
      <MouseGlow />
      
      {/* Content above the glow */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Global Demo Banner - Smooth Animation with Exit */}
        <AnimatePresence mode="wait">
          {isDemo && (
            <motion.div
              key="demo-banner"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.4 },
                height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
              }}
              className="w-full border-b border-indigo-500/40 bg-indigo-950/70 backdrop-blur overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs text-indigo-100"
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/80 text-[10px] font-bold"
                  >
                    i
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-semibold"
                  >
                    Demo Mode
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-indigo-200/90"
                  >
                    Showing sample data only. Toggle to Live (Supabase) to use real data.
                  </motion.span>
                </div>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMode}
                  className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-[11px] font-semibold text-indigo-100 hover:bg-indigo-500/30 transition-colors whitespace-nowrap"
                >
                  Switch to Live
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main className="relative flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/upload" element={<SubmitProof />} />
              <Route path="/student/verification" element={<StudentVerification />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/feed" element={<ImpactFeed />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-demo" element={<AIDemo />} />
              <Route path="/verification-demo" element={<VerificationDemo />} />
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/nft-claim" element={<NFTClaimPage />} />
              <Route path="/my-donations" element={<MyDonations />} />
            </Routes>
          </motion.div>
        </main>
        
        {/* Toast Notifications - Polished styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(30, 41, 59, 0.95)',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* AI Assistant - Available on all pages */}
        <AIAssistant type="general" />
      </div>
    </div>
  )
}

export default App


