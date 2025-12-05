import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X, RefreshCw, Copy, ExternalLink, Database } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HealthCheckResult } from '@/lib/supabase'
import { healthCheck } from '@/lib/supabase'

interface SupabaseStatusBannerProps {
  error?: HealthCheckResult | { message: string; type: 'env' | 'health' }
  healthStatus?: HealthCheckResult
  onRetry?: () => void
  onDismiss?: () => void
}

const SupabaseStatusBanner = ({ error, healthStatus, onRetry, onDismiss }: SupabaseStatusBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false)
  const [showMigrationModal, setShowMigrationModal] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Use healthStatus if provided, otherwise fall back to error
  const status = healthStatus || error

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      const result = await healthCheck()
      if (result.ok) {
        toast.success('Supabase connection restored!')
        onRetry?.()
      } else {
        toast.error(`Still having issues: ${result.message}`)
      }
    } catch (err) {
      toast.error('Retry failed')
    } finally {
      setIsRetrying(false)
    }
  }

  const copySQLToClipboard = async () => {
    try {
      // Read the SQL file content (in production, you'd fetch it)
      const sqlContent = `-- Run this in Supabase SQL Editor
-- File: supabase/migrations/001_create_schema.sql

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  student_id UUID REFERENCES users(id) ON DELETE SET NULL,
  country TEXT,
  field TEXT,
  year INT,
  goal NUMERIC DEFAULT 0,
  raised NUMERIC DEFAULT 0,
  milestones JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sequence INT DEFAULT 1,
  achieved BOOLEAN DEFAULT false,
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  tx_hash TEXT,
  network TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  verified_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON scholarships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_scholarship ON donations(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_milestones_scholarship ON milestones(scholarship_id);`

      await navigator.clipboard.writeText(sqlContent)
      toast.success('SQL copied to clipboard! Paste it in Supabase SQL Editor.')
      setShowMigrationModal(false)
    } catch (err) {
      toast.error('Failed to copy SQL')
    }
  }

  if (isDismissed || !status) return null

  const isEnvError = 'type' in status && status.type === 'env'
  const isUnauthorized = 'status' in status && (status.status === 401 || status.status === 403)
  const isNoRows = 'status' in status && status.status === 200 && status.message === 'No rows'

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`w-full border-b ${
            isEnvError || isUnauthorized
              ? 'border-red-500/40 bg-red-950/70'
              : 'border-blue-500/40 bg-blue-950/70'
          } backdrop-blur`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <AlertCircle className={`h-4 w-4 flex-shrink-0 ${
                isEnvError || isUnauthorized ? 'text-red-400' : 'text-blue-400'
              }`} />
              <div className="flex-1">
                {isEnvError ? (
                  <div>
                    <span className="font-semibold text-red-100">Supabase env vars missing.</span>
                    <span className="text-red-200/90 ml-2">
                      Live Mode cannot load data. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.
                    </span>
                  </div>
                ) : isUnauthorized ? (
                  <div>
                    <span className="font-semibold text-red-100">Unauthorized:</span>
                    <span className="text-red-200/90 ml-2">
                      Check VITE_SUPABASE_ANON_KEY and RLS policies. See README_SUPABASE.md for policy examples.
                    </span>
                  </div>
                ) : isNoRows ? (
                  <div>
                    <span className="font-semibold text-blue-100">No scholarships found.</span>
                    <span className="text-blue-200/90 ml-2">
                      Run the migration to create the schema, or add data in Supabase dashboard.
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-red-100">Supabase error:</span>
                    <span className="text-red-200/90 ml-2">
                      {'message' in status ? status.message : 'Unknown error'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isNoRows && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMigrationModal(true)}
                  className="rounded-lg border border-blue-400/50 bg-blue-500/20 px-3 py-1.5 text-[11px] font-semibold text-blue-100 hover:bg-blue-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Database className="h-3 w-3" />
                  Run Migration
                </motion.button>
              )}
              {onRetry && !isEnvError && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
                  Retry
                </motion.button>
              )}
              {onDismiss && (
                <button
                  onClick={() => {
                    setIsDismissed(true)
                    onDismiss()
                  }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Migration Modal */}
      {showMigrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Run Database Migration</h3>
              <button
                onClick={() => setShowMigrationModal(false)}
                className="p-1 rounded hover:bg-slate-800"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              Copy the SQL below and paste it into your Supabase SQL Editor, or use the CLI script.
            </p>
            <div className="flex gap-2 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copySQLToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
              >
                <Copy className="h-4 w-4" />
                Copy SQL
              </motion.button>
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Open Supabase
              </a>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-slate-300 font-mono">
                {`-- Run this in Supabase SQL Editor
-- File: supabase/migrations/001_create_schema.sql

CREATE TABLE IF NOT EXISTS users (...);
CREATE TABLE IF NOT EXISTS scholarships (...);
-- See full SQL in supabase/migrations/001_create_schema.sql`}
              </pre>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              Or use the CLI: <code className="bg-slate-800 px-2 py-1 rounded">./supabase/run-sql.sh</code>
            </p>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default SupabaseStatusBanner

