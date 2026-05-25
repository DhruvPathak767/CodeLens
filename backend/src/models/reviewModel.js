const mongoose = require("mongoose");

// Detailed Issue Result Child Schema
const issueSchema = new mongoose.Schema({
  severity: {
    type: String,
    enum: ["Critical", "Warning", "Suggestion"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Security", "Performance", "Best Practices", "Scalability"],
    required: true,
  },
  line: {
    type: mongoose.Schema.Types.Mixed, // Can be number or string (e.g. '12-15' or 4)
    default: "N/A",
  },
  issue: {
    type: String,
    required: [true, "Issue title is required"],
  },
  explanation: {
    type: String,
    required: [true, "Issue explanation is required"],
  },
  fix: {
    type: String,
    required: [true, "Proposed fix description is required"],
  },
  optimizedCode: {
    type: String,
    default: "",
  },
});

// Primary Review Model Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    projectName: {
      type: String,
      default: "Untitled Project",
      trim: true,
    },
    language: {
      type: String,
      required: [true, "Language identifier is required"],
    },
    originalCode: {
      type: String,
      required: [true, "Original code is required"],
    },
    reviewResults: [issueSchema],
    aiSummary: {
      type: String,
      default: "No summary generated",
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false }, // Store createdAt automatically
  }
);

// Indexing for search performance and paginated queries
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ user: 1, isBookmarked: 1 });
reviewSchema.index({ language: 1, riskScore: 1 });
reviewSchema.index(
  { projectName: "text", originalCode: "text", aiSummary: "text" },
  { language_override: "none" } // Bypass language stemming conflict
);

module.exports = mongoose.model("Review", reviewSchema);
