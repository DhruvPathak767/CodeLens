const ActivityLog = require("../models/activityLogModel");
const logger = require("../utils/logger");

/**
 * Asynchronously logs user activities to MongoDB.
 * Captures events in a background thread to prevent latency blocks.
 *
 * @param {string} userId - Authenticated user's ID
 * @param {string} action - Action label (e.g. 'review_creation')
 * @param {Object} [metadata={}] - Structured metadata stashed with the log
 */
const logActivity = async (userId, action, metadata = {}) => {
  if (!userId) return;

  try {
    // Save the log entry asynchronously
    ActivityLog.create({
      user: userId,
      action,
      metadata,
    }).then(() => {
      logger.info(`[Activity Logged] User: ${userId} -> Action: '${action}'`);
    }).catch((err) => {
      logger.warn(`[Activity Log Failure] Non-blocking database write error: ${err.message}`);
    });
  } catch (error) {
    // Absolute safety to ensure core APIs never crash on logger anomalies
    logger.error(`[Activity Log Exception] Logging framework error: ${error.message}`);
  }
};

module.exports = logActivity;
