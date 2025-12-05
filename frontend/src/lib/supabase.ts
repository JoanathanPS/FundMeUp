/**
 * Supabase client setup for FundMeUp
 * 
 * IMPORTANT: This uses the Supabase anon key which is safe for client-side use
 * ONLY if your Supabase tables have Row Level Security (RLS) policies enabled.
 * 
 * To enable RLS:
 * 1. Go to your Supabase dashboard
 * 2. Navigate to Authentication > Policies
 * 3. Create policies for your tables (e.g., scholarships, students, etc.)
 * 4. Example policy for public read access:
 *    - CREATE POLICY "Allow public read" ON scholarships FOR SELECT USING (true);
 * 
 * For write operations, create more restrictive policies based on your needs.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Config Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing'
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Supabase credentials not found!',
    '\n  VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌',
    '\n  VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌',
    '\n  Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env file.',
    '\n  IMPORTANT: Restart your dev server after creating/updating .env file!'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '')
  
  if (import.meta.env.DEV && !isConfigured) {
    console.warn('⚠️ Supabase not configured:', {
      url: supabaseUrl || 'missing',
      key: supabaseAnonKey ? 'present' : 'missing'
    })
  }
  
  return isConfigured
}

// Health check interface
export interface HealthCheckResult {
  ok: boolean
  status: number
  message?: string
}

/**
 * Performs a health check on the Supabase scholarships table
 * Returns status information about connectivity and permissions
 */
export const healthCheck = async (): Promise<HealthCheckResult> => {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: 0,
      message: 'Supabase env vars not configured'
    }
  }

  try {
    const { data, error, status } = await supabase
      .from('scholarships')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase health check error:', error)
      
      // Handle unauthorized/forbidden
      if (status === 401 || status === 403) {
        return {
          ok: false,
          status,
          message: 'Unauthorized or RLS blocks access'
        }
      }

      return {
        ok: false,
        status: status || 0,
        message: error.message || 'Unknown error'
      }
    }

    // Success - table is accessible
    return {
      ok: true,
      status: status || 200,
      message: data && data.length === 0 ? 'No rows' : 'OK'
    }
  } catch (err) {
    console.error('Supabase health check network error:', err)
    return {
      ok: false,
      status: 0,
      message: err instanceof Error ? err.message : 'Network error'
    }
  }
}

