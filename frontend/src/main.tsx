import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets'
import { Toaster } from 'react-hot-toast'
import { mainnet } from 'wagmi/chains'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { AppModeProvider } from './context/AppModeContext'
import './index.css'

// Import Wagmi and RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Remove loading fallback immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  const loadingFallback = rootElement.querySelector('.loading-fallback')
  if (loadingFallback) {
    loadingFallback.remove()
  }
}

// Also remove via timeout as backup
setTimeout(() => {
  const fallback = document.getElementById('loading-fallback')
  if (fallback) {
    fallback.remove()
  }
}, 100)

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

// Configure RainbowKit - getDefaultConfig automatically includes MetaMask, Coinbase, etc.
const config = getDefaultConfig({
  appName: 'FundMeUp',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id-for-fundmeup',
  chains: [mainnet],
  ssr: false,
})

console.log('RainbowKit config initialized successfully')

// Ensure loading fallback is removed before render
if (rootElement) {
  const loadingFallback = rootElement.querySelector('.loading-fallback') || document.getElementById('loading-fallback')
  if (loadingFallback) {
    loadingFallback.remove()
  }
}

try {
  ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppModeProvider>
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
      </AppModeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  )
  
  // Remove loading fallback after render
  setTimeout(() => {
    const fallback = document.getElementById('loading-fallback')
    if (fallback) {
      fallback.remove()
    }
  }, 100)
} catch (error) {
  console.error('Failed to render app:', error)
  const fallback = document.getElementById('loading-fallback')
  if (fallback) {
    fallback.innerHTML = `
      <div style="color: #ef4444; text-align: center;">
        <h2>Failed to load app</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #F97316; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
          Reload
        </button>
      </div>
    `
  }
}
