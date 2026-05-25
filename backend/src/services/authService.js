const User = require("../models/userModel");
const { ApiError } = require("../middleware/errorMiddleware");
const generateToken = require("../utils/generateToken");

/**
 * Service to register a new user in the system.
 *
 * @param {string} name - User's name
 * @param {string} email - User's unique email address
 * @param {string} password - Raw password (will be hashed pre-save)
 * @returns {Promise<Object>} - Contains user record and access token
 */
const signupUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "A user with this email address already exists.");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user info (without password) and token
  const userJson = user.toObject();
  delete userJson.password;

  return {
    user: userJson,
    token,
  };
};

/**
 * Service to authenticate user login credentials.
 *
 * @param {string} email - User's email address
 * @param {string} password - Raw password input
 * @returns {Promise<Object>} - Contains user record and access token
 */
const loginUser = async (email, password) => {
  // Find user by email and explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Compare passwords
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Generate token
  const token = generateToken(user._id);

  const userJson = user.toObject();
  delete userJson.password;

  return {
    user: userJson,
    token,
  };
};

module.exports = {
  signupUser,
  loginUser,
};
