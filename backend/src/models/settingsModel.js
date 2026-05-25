const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Settings must belong to a user"],
      unique: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "dark",
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    preferredLanguage: {
      type: String,
      default: "JavaScript",
    },
    aiModel: {
      type: String,
      default: "gemini-1.5-flash",
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model compiled automatically
module.exports = mongoose.model("UserSettings", userSettingsSchema);
