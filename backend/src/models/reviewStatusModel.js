const mongoose = require("mongoose");
const STATUS_TYPES = require("../constants/statusEnums");

const statusLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
});

const reviewStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      default: "Untitled Project",
    },
    language: {
      type: String,
      default: "Unknown",
    },
    originalCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS_TYPES),
      default: STATUS_TYPES.QUEUED,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    currentStage: {
      type: String,
      default: "Queued",
    },
    estimatedTime: {
      type: Number, // Estimated remaining seconds
      default: 15,
    },
    logs: [statusLogSchema],
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for status checks
reviewStatusSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ReviewStatus", reviewStatusSchema);
