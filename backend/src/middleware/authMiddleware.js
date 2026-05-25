const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ApiError } = require("./errorMiddleware");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to protect routes. Ensures request has a valid JWT token.
 * Attaches user record to request object as `req.user`.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization Header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fallback to token in Cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return next(new ApiError(401, "Not authorized. No token provided."));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request, excluding password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(401, "Not authorized. User no longer exists."));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Not authorized. Token verification failed."));
  }
});

/**
 * Middleware to restrict access based on roles.
 *
 * @param {...string} roles - Array of permitted roles (e.g., 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Forbidden. Role '${req.user ? req.user.role : "none"}' does not have access.`)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
