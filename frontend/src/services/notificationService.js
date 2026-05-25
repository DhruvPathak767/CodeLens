import api from './api'

/**
 * Service to manage alerts and notifications with backend APIs.
 */
export const notificationService = {
  /**
   * Retrieve all notifications
   * GET /api/notifications
   */
  async getNotifications() {
    const { data } = await api.get('/notifications')
    return data.data
  },

  /**
   * Mark specific notification as read
   * PUT /api/notifications/:id/read
   */
  async markAsRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`)
    return data.data
  },

  /**
   * Mark all unread notifications as read
   * PUT /api/notifications/read-all
   */
  async markAllAsRead() {
    const { data } = await api.put('/notifications/read-all')
    return data.data
  },
}
