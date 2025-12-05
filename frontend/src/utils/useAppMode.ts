/**
 * Custom hook to determine app mode (Demo or Live)
 * Reads from VITE_APP_MODE environment variable
 */
export const useAppMode = () => {
  const appMode = import.meta.env.VITE_APP_MODE || 'demo'
  const isDemo = appMode === 'demo'
  const mode = isDemo ? 'demo' : 'live' as 'demo' | 'live'

  return {
    isDemo,
    mode,
    appMode
  }
}

