const express = require("express");
const { signup, login, logout, getMe, googleLogin, forgotPassword, resetPassword } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../validators/authValidator");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Apply authLimiter only to registration/login endpoints to throttle heavy requests
router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, validateLogin, login);
router.post("/google", authLimiter, googleLogin);

// Password recovery endpoints
router.post("/forgotpassword", authLimiter, forgotPassword);
router.put("/resetpassword/:resettoken", authLimiter, resetPassword);

// Secure session endpoints
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
