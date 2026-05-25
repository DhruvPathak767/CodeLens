const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Activity log must belong to a user"],
    },
    action: {
      type: String,
      required: [true, "Activity log action is required"],
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Stash payload or action-specific details
      default: {},
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// High speed indexes for analytics and user tracking
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
