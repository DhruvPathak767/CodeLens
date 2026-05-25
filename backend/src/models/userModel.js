const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Ensure password is hidden by default in queries
    },
    avatar: {
      type: String,
      default: function () {
        // Fallback to dynamic gravatar or robohash
        return `https://robohash.org/${encodeURIComponent(this.email || "default")}.png?set=set4`;
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

userSchema.pre("save", async function () {
  // Only hash the password if it's modified or new
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Helper instance method to check password validity.
 *
 * @param {string} enteredPassword - Password entered by user
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate and hash password token
 *
 * @returns {string} - Raw token (unhashed)
 */
userSchema.methods.getResetPasswordToken = function () {
  const crypto = require("crypto");
  
  // Generate random token bytes
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and store in database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire duration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
