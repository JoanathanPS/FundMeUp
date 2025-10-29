import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import { useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <main className="relative">
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
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
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
  )
}

export default App


