import axios from 'axios'

// Base axios instance — update VITE_API_URL when backend is ready
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle global errors and standardized formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalizing error to standard SaaS shape
    const apiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.data || null,
      raw: error
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      
      // Prevent redirect loop if the user is already on auth pages
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(apiError)
  }
)

export default api
