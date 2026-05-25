const rateLimit = require("express-rate-limit");
const { sendError } = require("../utils/apiResponse");

/**
 * Standard handler for rate-limited responses.
 */
const limitHandler = (req, res, next, options) => {
  return sendError(
    res,
    options.statusCode || 429,
    options.message || "Too many requests, please try again later."
  );
};

/**
 * General API Limiter
 * Applied to all general resource routes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return standard rate limit info headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: "Too many requests from this IP. Please try again after 15 minutes.",
  handler: limitHandler,
});

/**
 * Strict Authentication Limiter
 * Throttles brute force attempts on signup and login.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login/signup attempts. Please try again after 15 minutes.",
  handler: limitHandler,
});

/**
 * Strict Review Analysis Limiter
 * Controls intensive calls to Gemini API to limit SaaS subscription costs.
 */
const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // Limit each IP to 30 analysis requests per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Daily code review quotas or short-term rate limits reached. Please try again in 10 minutes.",
  handler: limitHandler,
});

module.exports = {
  apiLimiter,
  authLimiter,
  reviewLimiter,
};
