import api from './api'

/**
 * Service to manage saved code snippets with backend APIs.
 */
export const snippetService = {
  /**
   * Save a new code snippet
   * POST /api/snippets
   */
  async createSnippet(snippetData) {
    const { data } = await api.post('/snippets', snippetData)
    return data.data
  },

  /**
   * Retrieve all saved code snippets
   * GET /api/snippets
   */
  async getSnippets() {
    const { data } = await api.get('/snippets')
    return data.data
  },

  /**
   * Retrieve single snippet details
   * GET /api/snippets/:id
   */
  async getSnippetById(id) {
    const { data } = await api.get(`/snippets/${id}`)
    return data.data
  },

  /**
   * Update saved snippet details
   * PUT /api/snippets/:id
   */
  async updateSnippet(id, updateData) {
    const { data } = await api.put(`/snippets/${id}`, updateData)
    return data.data
  },

  /**
   * Delete saved snippet record
   * DELETE /api/snippets/:id
   */
  async deleteSnippet(id) {
    const { data } = await api.delete(`/snippets/${id}`)
    return data.data
  },
}
