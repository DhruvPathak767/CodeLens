const reviewService = require("../services/reviewService");
const readUploadedFiles = require("../helpers/readUploadedFiles");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ApiError } = require("../middleware/errorMiddleware");
const API_MESSAGES = require("../constants/apiMessages");

/**
 * @desc    Queue raw code pasted by user for async AI review analysis
 * @route   POST /api/reviews/analyze
 * @access  Private
 */
const analyzeCode = asyncHandler(async (req, res, next) => {
  const { projectName, code, language } = req.body;

  if (!code) {
    return next(new ApiError(400, "Please provide some code in the 'code' parameter to analyze."));
  }

  // Launch async review analysis flow (returns ReviewStatus)
  const status = await reviewService.createReview(req.user._id, projectName, code, language);

  return sendSuccess(res, 202, API_MESSAGES.REVIEW.CREATED_ASYNC, status);
});

/**
 * @desc    Upload source code files and queue for async AI review analysis
 * @route   POST /api/reviews/upload
 * @access  Private
 */
const uploadCode = asyncHandler(async (req, res, next) => {
  const { projectName } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, "No files uploaded. Please upload a supported code file."));
  }

  // Read files contents, merge, resolve language, and clean up temp files
  const { mergedCode, language, fileMetadata } = await readUploadedFiles(req.files);

  if (!mergedCode) {
    return next(new ApiError(400, "Could not extract code from the uploaded files."));
  }

  // Queue async review analysis flow
  const status = await reviewService.createReview(
    req.user._id,
    projectName || req.files[0].originalname,
    mergedCode,
    language
  );

  return sendSuccess(res, 202, API_MESSAGES.REVIEW.CREATED_ASYNC, {
    status,
    filesUploadedCount: req.files.length,
    files: fileMetadata,
  });
});

/**
 * @desc    Get paginated, searched, and filtered list of user reviews
 * @route   GET /api/reviews
 * @access  Private
 */
const getReviews = asyncHandler(async (req, res, next) => {
  // Pass req.query directly to the enhanced getUserReviews service
  const result = await reviewService.getUserReviews(req.user._id, req.query);

  return sendSuccess(res, 200, "User reviews retrieved successfully", result);
});

/**
 * @desc    Get detailed single review by ID
 * @route   GET /api/reviews/:id
 * @access  Private
 */
const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await reviewService.getReviewById(req.params.id, req.user._id);

  return sendSuccess(res, 200, "Review details retrieved successfully", review);
});

/**
 * @desc    Delete review history entry
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const result = await reviewService.deleteReview(req.params.id, req.user._id);

  return sendSuccess(res, 200, API_MESSAGES.REVIEW.DELETED, result);
});

/**
 * @desc    Get review analysis progress/status
 * @route   GET /api/reviews/:id/status
 * @access  Private
 */
const getStatus = asyncHandler(async (req, res, next) => {
  const status = await reviewService.getReviewStatus(req.params.id, req.user._id);

  return sendSuccess(res, 200, "Review processing status retrieved successfully", status);
});

/**
 * @desc    Get review analysis background worker logs
 * @route   GET /api/reviews/:id/logs
 * @access  Private
 */
const getLogs = asyncHandler(async (req, res, next) => {
  const logs = await reviewService.getReviewLogs(req.params.id, req.user._id);

  return sendSuccess(res, 200, "Review processing logs retrieved successfully", logs);
});

/**
 * @desc    Bookmark an important code review
 * @route   POST /api/reviews/:id/bookmark
 * @access  Private
 */
const addBookmark = asyncHandler(async (req, res, next) => {
  const result = await reviewService.bookmarkReview(req.params.id, req.user._id);

  return sendSuccess(res, 200, API_MESSAGES.REVIEW.BOOKMARK_ADDED, result);
});

/**
 * @desc    Remove bookmark from a review
 * @route   DELETE /api/reviews/:id/bookmark
 * @access  Private
 */
const removeBookmark = asyncHandler(async (req, res, next) => {
  const result = await reviewService.unbookmarkReview(req.params.id, req.user._id);

  return sendSuccess(res, 200, API_MESSAGES.REVIEW.BOOKMARK_REMOVED, result);
});

/**
 * @desc    List all bookmarked code reviews
 * @route   GET /api/reviews/bookmarks
 * @access  Private
 */
const getBookmarks = asyncHandler(async (req, res, next) => {
  const reviews = await reviewService.getBookmarkedReviews(req.user._id);

  return sendSuccess(res, 200, "Bookmarked reviews retrieved successfully", reviews);
});

/**
 * @desc    Get aggregated analysis stats for user's dashboard (Legacy endpoint)
 * @route   GET /api/reviews/stats
 * @access  Private
 */
const getReviewStats = asyncHandler(async (req, res, next) => {
  const stats = await reviewService.getUserStats(req.user._id);

  return sendSuccess(res, 200, "Dashboard statistics retrieved successfully", stats);
});

module.exports = {
  analyzeCode,
  uploadCode,
  getReviews,
  getReviewById,
  deleteReview,
  getStatus,
  getLogs,
  addBookmark,
  removeBookmark,
  getBookmarks,
  getReviewStats,
};
