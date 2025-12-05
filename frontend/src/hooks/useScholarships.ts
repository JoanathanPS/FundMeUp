/**
 * Hook to fetch scholarships data
 * Returns sample data in Demo Mode, or fetches from Supabase in Live Mode
 * 
 * IMPORTANT: Live Mode NEVER falls back to sample data. If Supabase is empty or errors,
 * the hook returns empty data and an error object for the UI to handle.
 */

import { useQuery } from '@tanstack/react-query'
import { useAppMode } from '@/context/AppModeContext'
import { supabase, isSupabaseConfigured, healthCheck, HealthCheckResult } from '@/lib/supabase'
import { sampleScholarships, Scholarship } from '@/data/sampleScholarships'
import { scholarshipStorage } from '@/utils/scholarshipStorage'

interface UseScholarshipsOptions {
  page?: number
  limit?: number
  country?: string
  field?: string
}

interface UseScholarshipsReturn {
  data: Scholarship[]
  loading: boolean
  error: HealthCheckResult | { message: string; type: 'env' | 'health' } | null
  reload: () => void
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export const useScholarships = (options: UseScholarshipsOptions = {}): UseScholarshipsReturn => {
  const { isDemo } = useAppMode()
  const { page = 1, limit = 50, country, field } = options
  const offset = (page - 1) * limit

  const query = useQuery({
    queryKey: ['scholarships', isDemo, page, limit, country, field],
    queryFn: async () => {
      // Demo Mode: Merge localStorage and sample data
      if (isDemo) {
        // Get scholarships from localStorage
        const localScholarships = scholarshipStorage.getAllScholarships()
        
        // Convert local scholarships to Scholarship format
        const localAsScholarships: Scholarship[] = localScholarships.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          country: s.country,
          field: s.field,
          year: s.year,
          goal: s.goal,
          raised: s.raised,
          milestones: s.milestones.map(m => ({
            id: m.id,
            title: m.title,
            description: m.description,
            targetDate: m.targetDate,
            status: m.status as 'pending' | 'in_progress' | 'completed' | 'verified'
          })),
          verified: s.verified,
          created_at: s.createdAt,
          student_wallet: s.studentWallet,
          institution_name: s.institutionName
        }))
        
        // Merge with sample data (local takes precedence)
        const merged = [...sampleScholarships]
        localScholarships.forEach(local => {
          const existingIndex = merged.findIndex(s => s.id === local.id)
          if (existingIndex !== -1) {
            merged[existingIndex] = localAsScholarships.find(s => s.id === local.id) || merged[existingIndex]
          } else {
            merged.push(localAsScholarships.find(s => s.id === local.id)!)
          }
        })
        
        let filtered = merged
        
        if (country) {
          filtered = filtered.filter(s => s.country.toLowerCase().includes(country.toLowerCase()))
        }
        if (field) {
          filtered = filtered.filter(s => s.field.toLowerCase().includes(field.toLowerCase()))
        }
        
        return {
          data: filtered.slice(offset, offset + limit),
          total: filtered.length,
          error: null,
          healthCheckResult: null
        }
      }

      // Live Mode: Check env vars first
      if (!isSupabaseConfigured()) {
        console.error('Supabase env vars missing')
        return {
          data: [],
          total: 0,
          error: { message: 'Supabase env vars not configured', type: 'env' as const },
          healthCheckResult: null
        }
      }

      // Run health check first
      const healthResult = await healthCheck()
      console.log('Supabase health check:', healthResult)

      if (!healthResult.ok) {
        return {
          data: [],
          total: 0,
          error: healthResult,
          healthCheckResult: healthResult
        }
      }

      // Health check passed - fetch data
      try {
        let query = supabase
          .from('scholarships')
          .select('id, title, description, country, field, year, goal, raised, milestones, verified, created_at, institution_name, student_wallet', { count: 'exact' })
          .order('created_at', { ascending: false })

        if (country) {
          query = query.ilike('country', `%${country}%`)
        }
        if (field) {
          query = query.ilike('field', `%${field}%`)
        }

        const { data, error, count } = await query
          .range(offset, offset + limit - 1)

        if (error) {
          console.error('Error fetching scholarships:', error)
          return {
            data: [],
            total: 0,
            error: {
              ok: false,
              status: 0,
              message: error.message
            },
            healthCheckResult: null
          }
        }

        // Return data from Supabase (or empty array if no rows)
        // CRITICAL: Do NOT fall back to sampleScholarships in live mode
        return {
          data: (data as Scholarship[]) || [],
          total: count || 0,
          error: data && data.length === 0 ? healthResult : null, // Return health result if no rows
          healthCheckResult: healthResult
        }
      } catch (err) {
        console.error('Error fetching scholarships:', err)
        return {
          data: [],
          total: 0,
          error: {
            ok: false,
            status: 0,
            message: err instanceof Error ? err.message : 'Unknown error'
          },
          healthCheckResult: null
        }
      }
    },
    staleTime: isDemo ? Infinity : 2 * 60 * 1000, // 2 minutes for live data
    retry: isDemo ? false : 1,
    refetchOnWindowFocus: !isDemo, // Only refetch on focus in live mode
  })

  return {
    data: query.data?.data || [],
    loading: query.isLoading,
    error: query.data?.error || null,
    reload: () => query.refetch(),
    meta: query.data ? {
      total: query.data.total,
      page,
      limit
    } : undefined
  }
}

