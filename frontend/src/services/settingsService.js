import api from './api'

/**
 * Service to manage user settings and custom API keys with backend APIs.
 */
export const settingsService = {
  /**
   * Retrieve user preferences (theme, preferred model, notification switches)
   * GET /api/settings
   */
  async getSettings() {
    const { data } = await api.get('/settings')
    return data.data
  },

  /**
   * Update theme and review preferences
   * PUT /api/settings
   */
  async updateSettings(settingsData) {
    const { data } = await api.put('/settings', settingsData)
    return data.data
  },
}
