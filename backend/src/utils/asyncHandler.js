/**
 * Async wrapper utility to eliminate try-catch boilerplate in controllers.
 * Catches rejected promises and forwards them to the global error middleware.
 *
 * @param {Function} fn - Asynchronous Express middleware/controller function
 * @returns {Function} - Express route handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
