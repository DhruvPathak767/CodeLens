const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/**
 * Utility helper to attach JWT token inside a secure, HttpOnly cookie.
 */
const sendTokenCookie = (res, statusCode, message, authData) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevent client-side JS from accessing token
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",
  };

  res.cookie("token", authData.token, cookieOptions);

  return sendSuccess(res, statusCode, message, authData);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const result = await authService.signupUser(name, email, password);

  return sendTokenCookie(res, 201, "User registered successfully", result);
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  return sendTokenCookie(res, 200, "User logged in successfully", result);
});

/**
 * @desc    Log user out & clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Instantly expire cookie
  });

  return sendSuccess(res, 200, "User logged out successfully");
});

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  // `req.user` was already populated by the auth protect middleware
  return sendSuccess(res, 200, "User profile retrieved successfully", {
    user: req.user,
  });
});

const https = require("https");
const { ApiError } = require("../middleware/errorMiddleware");

/**
 * Verify Google id_token against Google OAuth public tokeninfo endpoint
 */
const verifyGoogleToken = (idToken) => {
  return new Promise((resolve, reject) => {
    https.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error("Failed to verify Google token: " + data));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
};

/**
 * @desc    Authenticate user via Google ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return next(new ApiError(400, "Please provide a Google ID Token"));
  }

  let payload;
  try {
    payload = await verifyGoogleToken(idToken);
  } catch (err) {
    return next(new ApiError(401, "Google OAuth verification failed: " + err.message));
  }

  const { email, name, picture, sub } = payload;
  if (!email) {
    return next(new ApiError(400, "Google token does not contain a verified email"));
  }

  const User = require("../models/userModel");
  const generateToken = require("../utils/generateToken");

  let user = await User.findOne({ email });
  if (!user) {
    // Generate secure random password complying with the schema rules
    const randomPassword = `GoogleAuthPassword-${sub || Math.random().toString(36).substring(2, 10)}`;
    user = await User.create({
      name: name || "Google User",
      email,
      password: randomPassword,
      avatar: picture,
    });
  } else if (picture && user.avatar !== picture) {
    user.avatar = picture;
    await user.save();
  }

  const token = generateToken(user._id);
  const userJson = user.toObject();
  delete userJson.password;

  return sendTokenCookie(res, 200, "Google login successful", {
    user: userJson,
    token,
  });
});

/**
 * @desc    Generate password reset token & email recovery link
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const crypto = require("crypto");
  const User = require("../models/userModel");
  const sendEmail = require("../services/emailService");
  const { ApiError } = require("../middleware/errorMiddleware");

  if (!email) {
    return next(new ApiError(400, "Please provide an email address"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "There is no user registered with that email address"));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Save the user record (exclude schema pre-save triggers or other fields validation if any, but since validateBeforeSave: false is clean)
  await user.save({ validateBeforeSave: false });

  // Create password reset routing URL
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/auth/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <h2 style="color: #22d3ee; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="font-size: 16px; line-height: 1.6;">You requested a password reset for your AI Code Reviewer account. Please click the button below to secure a new password:</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" target="_blank" style="background: linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);">Reset My Password</a>
      </div>
      <p style="font-size: 14px; color: #94a3b8;">This recovery link is active for <strong>10 minutes</strong>. If you did not request this email, you can safely ignore it.</p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">AI Code Reviewer Engine — Automated Security Telemetry</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - AI Code Reviewer",
      html,
    });

    return sendSuccess(res, 200, "Password reset link sent to your email");
  } catch (err) {
    // Wipe DB fields on error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, "Email could not be sent: " + err.message));
  }
});

/**
 * @desc    Validate reset token & update user password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { resettoken } = req.params;
  const crypto = require("crypto");
  const User = require("../models/userModel");
  const { ApiError } = require("../middleware/errorMiddleware");

  if (!password) {
    return next(new ApiError(400, "Please provide a new password"));
  }

  // Hash incoming parameter token to compare with saved SHA-256 hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, "Invalid or expired password reset token"));
  }

  // Set new password (will trigger user pre-save password hash hook)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return sendSuccess(res, 200, "Password reset successful. Please sign in.");
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
  googleLogin,
  forgotPassword,
  resetPassword,
};
