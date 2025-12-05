/**
 * Utility function to get app mode (demo vs live)
 * Reads from VITE_APP_MODE environment variable
 */
export function getAppMode() {
  const appMode = import.meta.env.VITE_APP_MODE || 'demo' // 'demo' | 'live'
  const isDemo = appMode === 'demo'
  return { appMode, isDemo }
}
