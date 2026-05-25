const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: [true, "Feedback must be linked to a review"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must belong to a user"],
    },
    rating: {
      type: Number,
      required: [true, "Rating score is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, "Feedback text cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// One feedback per user per review
feedbackSchema.index({ review: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("ReviewFeedback", feedbackSchema);
