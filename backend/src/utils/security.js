/**
 * Enterprise Input Sanitization & Security Hardening Middlewares
 */

/**
 * Recursively strips keys starting with '$' or containing dots to prevent NoSQL Injection attacks.
 * Bypasses Mongoose query manipulation hazards.
 *
 * @param {Object} obj - The request payload object (body, query, params)
 * @returns {Object} - The sanitized object
 */
const mongoSanitizeObject = (obj) => {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object" && obj[i] !== null) {
        mongoSanitizeObject(obj[i]);
      }
    }
  } else if (obj !== null && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        // Strip out the vulnerable MongoDB operator key
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        mongoSanitizeObject(obj[key]);
      }
    });
  }
  return obj;
};

/**
 * Middleware to sanitize request parameters against NoSQL injection.
 */
const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) mongoSanitizeObject(req.body);
  if (req.query) mongoSanitizeObject(req.query);
  if (req.params) mongoSanitizeObject(req.params);
  next();
};

/**
 * Sanitizes XSS payloads from string fields to block HTML script injection.
 * *Nuance*: Excludes source code parameters ('code', 'originalCode', 'optimizedCode') to prevent code corruption.
 *
 * @param {string} value - String value to sanitize
 * @returns {string} - Cleaned safe string
 */
const cleanStringXss = (value) => {
  if (typeof value !== "string") return value;

  return value
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // Strip <script>...</script>
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "") // Strip <iframe>...</iframe>
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip raw HTML brackets elsewhere
    .replace(/javascript:/gi, "") // Block inline javascript
    .replace(/on\w+\s*=/gi, ""); // Block inline event handlers (onerror=, onload=)
};

/**
 * Recursively traverses payload to clean text strings from XSS, skipping code-content keys.
 */
const xssSanitizeObject = (obj) => {
  if (obj !== null && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      // EXCLUDE code block fields to prevent template/C++ bracket corruption
      if (["code", "originalCode", "optimizedCode", "original_code"].includes(key)) {
        return;
      }

      if (typeof obj[key] === "string") {
        obj[key] = cleanStringXss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        xssSanitizeObject(obj[key]);
      }
    });
  }
};

/**
 * Middleware to sanitize request body and query against XSS injection.
 */
const xssSanitizeMiddleware = (req, res, next) => {
  if (req.body) xssSanitizeObject(req.body);
  if (req.query) xssSanitizeObject(req.query);
  next();
};

module.exports = {
  mongoSanitizeMiddleware,
  xssSanitizeMiddleware,
};
