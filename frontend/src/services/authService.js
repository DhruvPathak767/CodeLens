import api from './api'

/**
 * Service to manage authentication calls with the backend APIs.
 */
export const authService = {
  /**
   * Log in user
   * POST /api/auth/login
   */
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    // Recall backend standard format: { success, message, data: { user, token } }
    return data.data
  },

  /**
   * Log in user via Google OAuth Token
   * POST /api/auth/google
   */
  async googleLogin(idToken) {
    const { data } = await api.post('/auth/google', { idToken })
    return data.data
  },

  /**
   * Sign up a new user
   * POST /api/auth/signup
   */
  async signup(userData) {
    const { data } = await api.post('/auth/signup', userData)
    return data.data
  },

  /**
   * Log out active user
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.warn('Logout backend clean-up failed:', err.message)
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  /**
   * Load active user profile
   * GET /api/auth/me
   */
  async getProfile() {
    const { data } = await api.get('/auth/me')
    // Returns { user: { _id, name, email, role, avatar } }
    return data.data.user
  },

  /**
   * Send password recovery email
   * POST /api/auth/forgotpassword
   */
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgotpassword', { email })
    return data
  },

  /**
   * Reset user password with token
   * PUT /api/auth/resetpassword/:token
   */
  async resetPassword(token, password) {
    const { data } = await api.put(`/auth/resetpassword/${token}`, { password })
    return data
  },
}
