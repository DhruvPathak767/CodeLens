const jwt = require("jsonwebtoken");

/**
 * Generates a signed JSON Web Token (JWT) containing the user's ID.
 *
 * @param {string} id - The MongoDB user ID
 * @returns {string} - The signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token validity period
  });
};

module.exports = generateToken;
