const { sendError } = require("../utils/apiResponse");

/**
 * Custom Error Class for operational API exceptions.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log full stack trace in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    console.error(`[Error] ${err.name}: ${err.message}`);
  }

  // 1. Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field: ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // 2. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const details = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });
    error = new ApiError(400, "Validation Failed", details);
  }

  // 3. Mongoose Cast Error (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // 4. JWT JsonWebTokenError (invalid token)
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please authenticate again.");
  }

  // 5. JWT TokenExpiredError
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Your authentication token has expired. Please log in again.");
  }

  // 6. Multer File Upload Limits/Errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error = new ApiError(400, "File is too large. Maximum size is 5MB.");
  }
  if (err.name === "MulterError") {
    error = new ApiError(400, `File upload error: ${err.message}`);
  }

  // Fallback to internal server error if not custom operational error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const details = error.details || {};

  return sendError(res, statusCode, message, details);
};

module.exports = {
  ApiError,
  errorHandler,
};
