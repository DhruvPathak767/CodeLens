const validator = require("validator");
const { ApiError } = require("../middleware/errorMiddleware");

/**
 * Validates request payload for User Signup.
 */
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || validator.isEmpty(name.trim())) {
    errors.name = "Name is required";
  }

  if (!email || validator.isEmpty(email.trim())) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/;

  if (!password || validator.isEmpty(password)) {
    errors.password = "Password is required";
  } else if (!validator.isLength(password, { min: 8 })) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!passwordRegex.test(password)) {
    errors.password = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*(),.?\":{}|<>)";
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, "Validation Failed", errors));
  }

  next();
};

/**
 * Validates request payload for User Login.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || validator.isEmpty(email.trim())) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || validator.isEmpty(password)) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, "Validation Failed", errors));
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
};
