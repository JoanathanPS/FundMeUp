import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { Toaster } from 'react-hot-toast'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Import Wagmi and RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Remove loading fallback
const rootElement = document.getElementById('root')
if (rootElement) {
  const loadingFallback = rootElement.querySelector('.loading-fallback')
  if (loadingFallback) {
    loadingFallback.remove()
  }
}

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Configure RainbowKit with fallback
let config
try {
  config = getDefaultConfig({
    appName: 'FundMeUp',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id-for-local-dev',
    chains: [mainnet, sepolia, hardhat],
    ssr: false,
  })
} catch (error) {
  console.error('Error configuring RainbowKit:', error)
  // Create a minimal config as fallback
  config = getDefaultConfig({
    appName: 'FundMeUp',
    projectId: 'demo-project-id-for-local-dev',
    chains: [hardhat],
    ssr: false,
  })
}

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    iconTheme: {
                      primary: '#F97316',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
