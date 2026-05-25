/**
 * Standardized API Communication Messages
 */
const API_MESSAGES = {
  AUTH: {
    SIGNUP_SUCCESS: "User registered successfully.",
    LOGIN_SUCCESS: "User logged in successfully.",
    LOGOUT_SUCCESS: "User logged out successfully.",
    PROFILE_SUCCESS: "User profile retrieved successfully.",
    UNAUTHORIZED: "Not authorized. Please log in again.",
    FORBIDDEN: "Access forbidden. Role permissions missing.",
  },
  REVIEW: {
    CREATED_ASYNC: "Code review queued. Analysis has started in the background.",
    ANALYZING: "Code review is active in processing.",
    SUCCESS: "Code review analysis completed successfully.",
    NOT_FOUND: "Review not found or unauthorized access.",
    DELETED: "Review entry deleted successfully.",
    BOOKMARK_ADDED: "Review bookmarked successfully.",
    BOOKMARK_REMOVED: "Review bookmark removed successfully.",
    FEEDBACK_SUCCESS: "AI review feedback submitted successfully.",
    FEEDBACK_FETCHED: "AI review feedback retrieved successfully.",
  },
  SNIPPET: {
    CREATED: "Code snippet saved successfully.",
    UPDATED: "Code snippet updated successfully.",
    DELETED: "Code snippet deleted successfully.",
    FETCHED: "Code snippets retrieved successfully.",
    NOT_FOUND: "Code snippet not found or unauthorized.",
  },
  SETTINGS: {
    FETCHED: "User settings retrieved successfully.",
    UPDATED: "User settings updated successfully.",
    KEY_SAVED: "API key stored and encrypted successfully.",
    KEY_DELETED: "API key deleted successfully.",
    KEY_FETCHED: "API key status retrieved successfully.",
  },
  GENERAL: {
    HEALTHY: "Server is healthy and online.",
    ROUTE_NOT_FOUND: "Requested API route not found.",
    SERVER_ERROR: "Internal server error occurred.",
  },
};

module.exports = API_MESSAGES;
