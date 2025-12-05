import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Student API
export const studentAPI = {
  create: (data: any) => api.post('/api/students', data),
  getAll: () => api.get('/api/students'),
  getByWallet: (wallet: string) => api.get(`/api/students/${wallet}`),
  update: (wallet: string, data: any) => api.put(`/api/students/${wallet}`, data),
  delete: (wallet: string) => api.delete(`/api/students/${wallet}`),
}

// Scholarship API
export const scholarshipAPI = {
  create: (data: any) => api.post('/api/scholarships', data),
  getAll: () => api.get('/api/scholarships'),
  getById: (id: string) => api.get(`/api/scholarships/${id}`),
  fund: (id: string, data: any) => api.post(`/api/scholarships/${id}/fund`, data),
  getByStudent: (studentId: string) => api.get(`/api/scholarships/student/${studentId}`),
}

// Proof API
export const proofAPI = {
  submit: (data: any) => api.post('/api/proofs', data),
  getAll: () => api.get('/api/proofs'),
  getByStudent: (studentId: string) => api.get(`/api/proofs/student/${studentId}`),
  verify: (id: string) => api.post(`/api/proofs/${id}/verify`),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Transaction API
export const transactionAPI = {
  getAll: () => api.get('/api/transactions'),
  getByStudent: (studentId: string) => api.get(`/api/transactions/student/${studentId}`),
  getByWallet: (wallet: string) => api.get(`/api/transactions/wallet/${wallet}`),
}

// Encouragement API
export const encouragementAPI = {
  send: (data: any) => api.post('/api/encourage', data),
  getByStudent: (studentId: string) => api.get(`/api/encourage/${studentId}`),
  getAll: () => api.get('/api/encourage'),
}

// Feed API
export const feedAPI = {
  getRecent: () => api.get('/api/feed'),
  getActivity: (type?: string) => api.get(`/api/feed?type=${type || 'all'}`),
}

// Leaderboard API
export const leaderboardAPI = {
  getDonors: () => api.get('/api/leaderboard/donors'),
  getStudents: () => api.get('/api/leaderboard/students'),
  getStats: () => api.get('/api/leaderboard/stats'),
  getHeatmap: () => api.get('/api/analytics/heatmap'),
  getTrends: (period: string) => api.get(`/api/analytics/trends?period=${period}`),
  getLeaderboard: (type: string) => api.get(`/api/analytics/leaderboard?type=${type}`),
}

// AI API
export const aiAPI = {
  analyzeProfile: (data: any) => api.post('/ai/analyze-profile', data),
  ocrRisk: (data: any) => api.post('/ai/ocr-risk', data),
  generateMessage: (data: any) => api.post('/ai/generate-message', data),
  match: (data: any) => api.post('/ai/match', data),
  // Enhanced AI V2 endpoints
  analyzeProof: (data: any) => api.post('/ai/v2/analyze-proof', data),
  verifyEligibility: (data: any) => api.post('/ai/v2/verify-eligibility', data),
  generateEncouragement: (data: any) => api.post('/ai/v2/generate-encouragement', data),
  verifyRegional: (data: any) => api.post('/ai/v2/verify-regional', data),
}

// Chat API (Gemini-powered AI Assistant)
// Uses Vercel serverless function at /api/chat
export const chatAPI = {
  sendMessage: (data: { message: string; context?: string; userType?: string }) => {
    // Always use relative path - Vercel will route to serverless function
    return api.post('/api/chat', data)
  },
  getStats: () => {
    return api.get('/api/chat/stats')
  },
}

// Email Verification API
export const emailVerificationAPI = {
  requestEmail: (data: any) => api.post('/verification/v3/request-email', data),
  verifyEmail: (data: any) => api.post('/verification/v3/verify-email', data),
  getStatus: (verificationId: string) => api.get(`/verification/v3/status/${verificationId}`),
  complete: (data: any) => api.post('/verification/v3/complete', data),
}

// Institution Verification API
export const verificationAPI = {
  verify: (data: any) => api.post('/verify-institution', data),
  getPending: () => api.get('/verification/pending'),
  approve: (id: string) => api.post(`/verification/${id}/approve`),
  reject: (id: string) => api.post(`/verification/${id}/reject`),
  // Email verification endpoints
  requestEmailVerification: (data: any) => api.post('/verification/v3/request-email', data),
  verifyEmailCode: (data: any) => api.post('/verification/v3/verify-email', data),
  getEmailVerificationStatus: (verificationId: string) => api.get(`/verification/v3/status/${verificationId}`),
}

export default api
export { api }
