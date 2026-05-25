import api from './api'

/**
 * Service to manage code review actions with the backend APIs.
 */
export const reviewService = {
  /**
   * Fetch paginated list of reviews with search, sort, and filters
   * GET /api/reviews
   */
  async getReviews(params = {}) {
    const { data } = await api.get('/reviews', { params })
    // Returns { reviews, pagination: { total, page, limit, pages } }
    return data.data
  },

  /**
   * Fetch detailed review by ID
   * GET /api/reviews/:id
   */
  async getReviewById(id) {
    const { data } = await api.get(`/reviews/${id}`)
    return data.data
  },

  /**
   * Queue raw text code paste for async review
   * POST /api/reviews/analyze
   */
  async createReview({ code, language, projectName }) {
    const { data } = await api.post('/reviews/analyze', { code, language, projectName })
    // Returns the ReviewStatus tracking document
    return data.data
  },

  /**
   * Upload code files and queue for async review
   * POST /api/reviews/upload
   */
  async uploadCode(formData) {
    const { data } = await api.post('/reviews/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Returns the ReviewStatus tracking document
    return data.data
  },

  /**
   * Retrieve active code review status and progress
   * GET /api/reviews/:id/status
   */
  async getReviewStatus(id) {
    const { data } = await api.get(`/reviews/${id}/status`)
    // Returns { status, progress, currentStage, estimatedTime, review, error }
    return data.data
  },

  /**
   * Retrieve active code review progress logs
   * GET /api/reviews/:id/logs
   */
  async getReviewLogs(id) {
    const { data } = await api.get(`/reviews/${id}/logs`)
    // Returns logs array: [{ timestamp, message, stage }]
    return data.data
  },

  /**
   * Delete a code review record
   * DELETE /api/reviews/:id
   */
  async deleteReview(id) {
    const { data } = await api.delete(`/reviews/${id}`)
    return data.data
  },

  /**
   * Bookmark an important review
   * POST /api/reviews/:id/bookmark
   */
  async bookmarkReview(id) {
    const { data } = await api.post(`/reviews/${id}/bookmark`)
    return data.data
  },

  /**
   * Remove bookmark from a review
   * DELETE /api/reviews/:id/bookmark
   */
  async unbookmarkReview(id) {
    const { data } = await api.delete(`/reviews/${id}/bookmark`)
    return data.data
  },

  /**
   * Retrieve all bookmarked reviews
   * GET /api/reviews/bookmarks
   */
  async getBookmarks() {
    const { data } = await api.get('/reviews/bookmarks')
    return data.data
  },

  /**
   * Get basic dashboard statistics (Legacy stats endpoint)
   * GET /api/reviews/stats
   */
  async getStats() {
    const { data } = await api.get('/reviews/stats')
    return data.data
  },
}
