/**
 * Standardized API Response Utilities for Front-End integration readiness.
 */

/**
 * Sends a standardized success response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP Status Code (default 200)
 * @param {string} message - Description message
 * @param {Object|Array} [data={}] - Response content payload
 */
const sendSuccess = (res, statusCode = 200, message = "Success", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP Status Code (default 500)
 * @param {string} message - Error description
 * @param {Object|Array} [errorDetails={}] - Additional structured details of the error
 */
const sendError = (res, statusCode = 500, message = "An error occurred", errorDetails = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
