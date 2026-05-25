import api from './api'

/**
 * Service to interface with the Mongoose aggregates dashboard analytics APIs.
 */
export const dashboardService = {
  /**
   * Retrieve total reviews count, issues, average risk rating, and status grade
   * GET /api/dashboard/overview
   */
  async getOverview() {
    const { data } = await api.get('/dashboard/overview')
    return data.data
  },

  /**
   * Retrieve 30-day review volume calendars
   * GET /api/dashboard/activity
   */
  async getActivity() {
    const { data } = await api.get('/dashboard/activity')
    return data.data
  },

  /**
   * Retrieve reviews volume and risk score averages per programming language
   * GET /api/dashboard/languages
   */
  async getLanguages() {
    const { data } = await api.get('/dashboard/languages')
    return data.data
  },

  /**
   * Retrieve Critical/Warning/Suggestion issues totals
   * GET /api/dashboard/severity-breakdown
   */
  async getSeverityBreakdown() {
    const { data } = await api.get('/dashboard/severity-breakdown')
    return data.data
  },

  /**
   * Retrieve weekly aggregates trends over time (avg risk rating, issues counts)
   * GET /api/dashboard/trends
   */
  async getTrends() {
    const { data } = await api.get('/dashboard/trends')
    return data.data
  },
}
