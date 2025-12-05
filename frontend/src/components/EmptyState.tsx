import { motion } from 'framer-motion'
import { Database, RefreshCw, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAppMode } from '@/context/AppModeContext'

interface EmptyStateProps {
  title?: string
  message?: string
  showToggle?: boolean
  showMigrationCTA?: boolean
  onRunMigration?: () => void
}

const EmptyState = ({ 
  title = "No scholarships yet",
  message,
  showToggle = true,
  showMigrationCTA = false,
  onRunMigration
}: EmptyStateProps) => {
  const { isDemo, toggleMode } = useAppMode()
  const [showMigrationModal, setShowMigrationModal] = useState(false)

  const copySQLToClipboard = async () => {
    try {
      const sqlContent = `-- Run this in Supabase SQL Editor
-- See full SQL in supabase/migrations/001_create_schema.sql`
      await navigator.clipboard.writeText(sqlContent)
      toast.success('SQL instructions copied! See README_SUPABASE.md for full SQL.')
      setShowMigrationModal(false)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4"
        >
          <Database className="h-8 w-8 text-slate-400" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-slate-400 mb-6">
          {message || (
            isDemo 
              ? "Switch to Live Mode to fetch data from Supabase, or add data in Supabase dashboard."
              : "Add scholarships in Supabase or switch to Demo Mode to view sample data."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showMigrationCTA && !isDemo && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (onRunMigration) {
                  onRunMigration()
                } else {
                  setShowMigrationModal(true)
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
            >
              <Database className="h-4 w-4" />
              Run Migration
            </motion.button>
          )}
          {showToggle && (
            <>
              {!isDemo && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleMode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  Switch to Demo Mode
                </motion.button>
              )}
              {isDemo && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleMode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                >
                  <Database className="h-4 w-4" />
                  Switch to Live Mode
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default EmptyState

