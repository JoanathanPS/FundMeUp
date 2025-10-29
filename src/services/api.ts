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
  create: (data: any) => api.post('/students', data),
  getAll: () => api.get('/students'),
  getByWallet: (wallet: string) => api.get(`/students/${wallet}`),
  update: (wallet: string, data: any) => api.put(`/students/${wallet}`, data),
  delete: (wallet: string) => api.delete(`/students/${wallet}`),
}

// Scholarship API
export const scholarshipAPI = {
  create: (data: any) => api.post('/scholarships', data),
  getAll: () => api.get('/scholarships'),
  getById: (id: string) => api.get(`/scholarships/${id}`),
  fund: (id: string, data: any) => api.post(`/scholarships/${id}/fund`, data),
  getByStudent: (studentId: string) => api.get(`/scholarships/student/${studentId}`),
}

// Proof API
export const proofAPI = {
  submit: (data: any) => api.post('/proofs', data),
  getAll: () => api.get('/proofs'),
  getByStudent: (studentId: string) => api.get(`/proofs/student/${studentId}`),
  verify: (id: string) => api.post(`/proofs/${id}/verify`),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Transaction API
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getByStudent: (studentId: string) => api.get(`/transactions/student/${studentId}`),
  getByWallet: (wallet: string) => api.get(`/transactions/wallet/${wallet}`),
}

// Encouragement API
export const encouragementAPI = {
  send: (data: any) => api.post('/encourage', data),
  getByStudent: (studentId: string) => api.get(`/encourage/${studentId}`),
  getAll: () => api.get('/encourage'),
}

// Feed API
export const feedAPI = {
  getRecent: () => api.get('/feed'),
  getActivity: (type?: string) => api.get(`/feed?type=${type || 'all'}`),
}

// Leaderboard API
export const leaderboardAPI = {
  getDonors: () => api.get('/leaderboard/donors'),
  getStudents: () => api.get('/leaderboard/students'),
  getStats: () => api.get('/leaderboard/stats'),
  getHeatmap: () => api.get('/analytics/heatmap'),
  getTrends: (period: string) => api.get(`/analytics/trends?period=${period}`),
  getLeaderboard: (type: string) => api.get(`/analytics/leaderboard?type=${type}`),
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
