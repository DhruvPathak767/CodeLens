import api from './api'

/**
 * Service to manage code review report exports from the backend APIs.
 * Employs Axios binary blobs to preserve secure authorization headers.
 */
export const exportService = {
  /**
   * Downloads a review report in target format (json, markdown, pdf)
   *
   * @param {string} id - The MongoDB Review ID
   * @param {string} format - The export format ('json', 'markdown', 'pdf')
   */
  async downloadReport(id, format) {
    // Resolve target path (e.g. /reviews/:id/export/markdown)
    const response = await api.get(`/reviews/${id}/export/${format}`, {
      responseType: 'blob', // Required to download raw text/binary streams safely
    })

    // Capture response details
    const data = response.data
    const headers = response.headers

    // Resolve filename from Content-Disposition headers or fallback to defaults
    const disposition = headers['content-disposition']
    let filename = `audit_report_${id.substring(0, 6)}.${format === 'pdf' ? 'html' : format === 'markdown' ? 'md' : 'json'}`
    
    if (disposition && disposition.indexOf('filename=') !== -1) {
      filename = disposition.split('filename=')[1].replace(/["']/g, '')
    }

    // Create client-side temporary download anchor
    const blob = new Blob([data], { type: headers['content-type'] || 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    
    // Trigger download click
    link.click()
    
    // Clean up DOM and memory vectors
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
