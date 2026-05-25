const ReviewFeedback = require("../models/feedbackModel");
const Review = require("../models/reviewModel");
const logActivity = require("../helpers/activityLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ApiError } = require("../middleware/errorMiddleware");
const API_MESSAGES = require("../constants/apiMessages");

/**
 * @desc    Submit or update feedback rating for an AI code review
 * @route   POST /api/reviews/:id/feedback
 * @access  Private
 */
const createFeedback = asyncHandler(async (req, res, next) => {
  const { rating, feedback } = req.body;
  const reviewId = req.params.id;

  if (rating === undefined) {
    return next(new ApiError(400, "Please provide a rating value between 1 and 5."));
  }

  // Validate review exists and belongs to the user
  const review = await Review.findOne({ _id: reviewId, user: req.user._id }).lean();
  if (!review) {
    return next(new ApiError(404, "Code review record not found."));
  }

  // Upsert user feedback rating (updates if already configured)
  const result = await ReviewFeedback.findOneAndUpdate(
    { review: reviewId, user: req.user._id },
    { rating, feedback },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  // Log activity
  logActivity(req.user._id, "review_feedback_submit", { reviewId, rating });

  return sendSuccess(res, 201, API_MESSAGES.REVIEW.FEEDBACK_SUCCESS, result);
});

/**
 * @desc    Retrieve submitted feedback rating for an AI code review
 * @route   GET /api/reviews/:id/feedback
 * @access  Private
 */
const getFeedback = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;

  const result = await ReviewFeedback.findOne({ review: reviewId, user: req.user._id }).lean();
  if (!result) {
    return sendSuccess(res, 200, "No feedback configured yet for this review.", null);
  }

  return sendSuccess(res, 200, API_MESSAGES.REVIEW.FEEDBACK_FETCHED, result);
});

module.exports = {
  createFeedback,
  getFeedback,
};
