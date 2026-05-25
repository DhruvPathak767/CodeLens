const Review = require("../models/reviewModel");
const ReviewStatus = require("../models/reviewStatusModel");
const Notification = require("../models/notificationModel");
const logActivity = require("../helpers/activityLogger");
const { generateCodeReview } = require("./aiReviewService");
const detectLanguage = require("../utils/detectLanguage");
const calculateRiskScore = require("../utils/calculateRiskScore");
const { ApiError } = require("../middleware/errorMiddleware");
const STATUS_TYPES = require("../constants/statusEnums");
const NOTIFICATION_TYPES = require("../constants/notificationEnums");
const logger = require("../utils/logger");

/**
 * Background worker task executing code analysis steps progressively.
 */
const runBackgroundReview = async (statusId, userId, projectName, originalCode, language) => {
  logger.info(`[Background Worker] Launching code review worker for Status: ${statusId}`);

  const updateStage = async (status, progress, currentStage, logMsg, estimatedTime) => {
    try {
      await ReviewStatus.findByIdAndUpdate(statusId, {
        $set: { status, progress, currentStage, estimatedTime },
        $push: { logs: { message: logMsg, stage: currentStage } },
      });
    } catch (err) {
      logger.error(`[Background Worker] Status update failed: ${err.message}`);
    }
  };

  try {
    // 1. Shift to Analyzing
    await updateStage(
      STATUS_TYPES.ANALYZING,
      20,
      "Analyzing",
      "Parsing source code structure and loading AI review parameters...",
      12
    );

    // 3. Shift to Security Scan
    await updateStage(
      STATUS_TYPES.SECURITY_SCAN,
      40,
      "Security Scan",
      "Scanning code for security vulnerabilities, hardcoded secrets, and OWASP hazards...",
      9
    );
    await new Promise((r) => setTimeout(r, 600)); // Simulate analysis timing

    // 4. Shift to Performance Analysis
    await updateStage(
      STATUS_TYPES.PERFORMANCE_ANALYSIS,
      55,
      "Performance Analysis",
      "Inspecting algorithmic complexity, slow database queries, and memory block leaks...",
      6
    );
    await new Promise((r) => setTimeout(r, 600));

    // 5. Shift to Scalability Check
    await updateStage(
      STATUS_TYPES.SCALABILITY_CHECK,
      70,
      "Scalability Check",
      "Evaluating vertical/horizontal scaling limits, thread concurrency, and CPU bottlenecks...",
      4
    );

    // 6. Shift to Generating Fixes
    await updateStage(
      STATUS_TYPES.GENERATING_FIXES,
      85,
      "Generating Fixes",
      "Issuing requests to Gemini AI model and generating optimized refactoring suggestions...",
      2
    );

    // Call Gemini Generative AI SDK
    const aiResult = await generateCodeReview(originalCode, language);

    // Calculate Risk Rating Score
    const riskScore = calculateRiskScore(aiResult.issues);

    // Save final Review document in MongoDB
    const review = await Review.create({
      user: userId,
      projectName: projectName || "Untitled Review",
      language,
      originalCode,
      reviewResults: aiResult.issues,
      aiSummary: aiResult.summary,
      riskScore,
    });

    // 7. Update status tracker as completed
    await ReviewStatus.findByIdAndUpdate(statusId, {
      $set: {
        status: STATUS_TYPES.COMPLETED,
        progress: 100,
        currentStage: "Completed",
        estimatedTime: 0,
        review: review._id,
      },
      $push: {
        logs: {
          message: `✅ Review successfully generated! Review Document ID: ${review._id}`,
          stage: "Completed",
        },
      },
    });

    logger.success(`[Background Worker] Code review generated successfully for review: ${review._id}`);

    // Create notifications for the user
    await Notification.create({
      user: userId,
      title: "Code Review Completed",
      message: `Review for project '${projectName}' has completed with a risk score of ${riskScore}.`,
      type: NOTIFICATION_TYPES.REVIEW_COMPLETED,
    });

    // Send a separate critical alert if risk rating is critical
    if (riskScore >= 50 || aiResult.issues.some((issue) => issue.severity === "Critical")) {
      await Notification.create({
        user: userId,
        title: "Critical Vulnerabilities Detected",
        message: `High risk rating identified in '${projectName}'! Remediation highly recommended.`,
        type: NOTIFICATION_TYPES.CRITICAL_ISSUE,
      });
    }

    // Register action inside telemetry activity logging system
    logActivity(userId, "review_creation", { reviewId: review._id, projectName, riskScore });
  } catch (error) {
    logger.error(`[Background Worker Failure] Pipeline failed for status ${statusId}: ${error.message}`);

    // Update status object as failed
    await ReviewStatus.findByIdAndUpdate(statusId, {
      $set: {
        status: STATUS_TYPES.FAILED,
        progress: 100,
        currentStage: "Failed",
        estimatedTime: 0,
        error: error.message,
      },
      $push: {
        logs: {
          message: `❌ Generation failed: ${error.message}`,
          stage: "Failed",
        },
      },
    });

    // Dispatch error alert notification
    await Notification.create({
      user: userId,
      title: "Code Review Generation Failed",
      message: `Review generation failed for project '${projectName}': ${error.message}`,
      type: NOTIFICATION_TYPES.SYSTEM,
    });

    logActivity(userId, "review_creation_failed", { statusId, error: error.message });
  }
};

/**
 * Service to execute the complete review analysis flow asynchronously.
 * Auto-detects language, registers status document, and triggers background worker.
 *
 * @param {string} userId - ID of the authenticated user
 * @param {string} [projectName] - Optional project label
 * @param {string} originalCode - Source code contents
 * @param {string} [languageInput] - User supplied language or empty
 * @returns {Promise<Object>} - The initial ReviewStatus document
 */
const createReview = async (userId, projectName, originalCode, languageInput) => {
  if (!originalCode || originalCode.trim() === "") {
    throw new ApiError(400, "Code content is empty. Please provide source code for analysis.");
  }

  // 1. Resolve Language immediately in main thread
  const language = languageInput ? languageInput : detectLanguage(null, originalCode);
  const projName = projectName || "Untitled Review";

  // 2. Initialize the ReviewStatus tracking document
  const status = await ReviewStatus.create({
    user: userId,
    projectName: projName,
    language,
    originalCode,
    status: STATUS_TYPES.QUEUED,
    progress: 10,
    currentStage: "Queued",
    estimatedTime: 15,
    logs: [
      {
        message: "Code review request received and successfully queued.",
        stage: "Queued",
      },
    ],
  });

  // 3. Dispatch the pipeline worker asynchronously (Non-blocking)
  setImmediate(() => {
    runBackgroundReview(status._id, userId, projName, originalCode, language);
  });

  return status;
};

/**
 * Service to fetch user's review history with advanced filters, searching, and pagination.
 *
 * @param {string} userId - ID of the authenticated user
 * @param {Object} options - Search and filtering parameters
 * @returns {Promise<Object>} - Paginated and filtered reviews
 */
const getUserReviews = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build MongoDB query filters dynamically
  const query = { user: userId };

  // 1. Keyword search (scans projectName, originalCode, or aiSummary using text index)
  if (options.search && options.search.trim() !== "") {
    const cleanSearch = options.search.trim();
    query.$or = [
      { projectName: { $regex: cleanSearch, $options: "i" } },
      { originalCode: { $regex: cleanSearch, $options: "i" } },
      { aiSummary: { $regex: cleanSearch, $options: "i" } },
    ];
  }

  // 2. Language filter
  if (options.language && options.language.trim() !== "") {
    query.language = { $regex: new RegExp(`^${options.language.trim()}$`, "i") };
  }

  // 3. Severity filter (matches reviews containing at least one issue with target severity)
  if (options.severity && options.severity.trim() !== "") {
    query["reviewResults.severity"] = options.severity.trim();
  }

  // 4. Bookmarks filter
  if (options.isBookmarked !== undefined) {
    query.isBookmarked = options.isBookmarked === "true" || options.isBookmarked === true;
  }

  // 5. Date filter
  if (options.startDate || options.endDate) {
    query.createdAt = {};
    if (options.startDate) {
      query.createdAt.$gte = new Date(options.startDate);
    }
    if (options.endDate) {
      query.createdAt.$lte = new Date(options.endDate);
    }
  }

  // Build Sort metrics dynamically
  let sortCriteria = { createdAt: -1 }; // default: latest
  if (options.sort) {
    switch (options.sort) {
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "risk-high":
        sortCriteria = { riskScore: -1, createdAt: -1 };
        break;
      case "risk-low":
        sortCriteria = { riskScore: 1, createdAt: -1 };
        break;
      case "latest":
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }
  }

  // Execute database query with lean cursor optimization
  const [reviews, total] = await Promise.all([
    Review.find(query)
      .select("projectName language riskScore isBookmarked createdAt aiSummary reviewResults.severity")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Service to fetch details of a specific review with owner verification.
 */
const getReviewById = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, user: userId }).lean();
  if (!review) {
    throw new ApiError(404, "Review not found or you are not authorized to view it.");
  }
  return review;
};

/**
 * Service to delete a specific review record.
 */
const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!review) {
    throw new ApiError(404, "Review not found or you are not authorized to delete it.");
  }

  // Log activity
  logActivity(userId, "review_delete", { reviewId });

  return { id: reviewId };
};

/**
 * Service to fetch active analysis status.
 */
const getReviewStatus = async (statusId, userId) => {
  const status = await ReviewStatus.findOne({ _id: statusId, user: userId })
    .populate("review", "_id projectName riskScore")
    .lean();

  if (!status) {
    throw new ApiError(404, "Review progress tracker record not found.");
  }

  return {
    status: status.status,
    progress: status.progress,
    currentStage: status.currentStage,
    estimatedTime: status.estimatedTime,
    review: status.review || null,
    error: status.error || null,
  };
};

/**
 * Service to fetch active analysis execution logs.
 */
const getReviewLogs = async (statusId, userId) => {
  const status = await ReviewStatus.findOne({ _id: statusId, user: userId }).select("logs").lean();
  if (!status) {
    throw new ApiError(404, "Review progress tracker record not found.");
  }
  return status.logs || [];
};

/**
 * Service to bookmark a specific review record.
 */
const bookmarkReview = async (reviewId, userId) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { $set: { isBookmarked: true } },
    { new: true }
  ).lean();

  if (!review) {
    throw new ApiError(404, "Review not found or you are not authorized to bookmark it.");
  }

  // Log action
  logActivity(userId, "review_bookmark_add", { reviewId });

  return { id: reviewId, isBookmarked: true };
};

/**
 * Service to remove bookmark from a review record.
 */
const unbookmarkReview = async (reviewId, userId) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { $set: { isBookmarked: false } },
    { new: true }
  ).lean();

  if (!review) {
    throw new ApiError(404, "Review not found or you are not authorized to unbookmark it.");
  }

  // Log action
  logActivity(userId, "review_bookmark_remove", { reviewId });

  return { id: reviewId, isBookmarked: false };
};

/**
 * Service to retrieve all bookmarked reviews for a user.
 */
const getBookmarkedReviews = async (userId) => {
  const reviews = await Review.find({ user: userId, isBookmarked: true })
    .select("projectName language riskScore isBookmarked createdAt aiSummary reviewResults.severity")
    .sort({ createdAt: -1 })
    .lean();

  return reviews;
};

/**
 * Legacy service to compile review analytics metrics for dashboard.
 */
const getUserStats = async (userId) => {
  const reviews = await Review.find({ user: userId }).lean();

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRiskScore: 0,
      severityBreakdown: { Critical: 0, Warning: 0, Suggestion: 0 },
      categoryBreakdown: { Security: 0, Performance: 0, "Best Practices": 0, Scalability: 0 },
      languageBreakdown: {},
    };
  }

  let totalRiskScore = 0;
  const severityBreakdown = { Critical: 0, Warning: 0, Suggestion: 0 };
  const categoryBreakdown = { Security: 0, Performance: 0, "Best Practices": 0, Scalability: 0 };
  const languageBreakdown = {};

  reviews.forEach((review) => {
    totalRiskScore += review.riskScore;

    // Count language occurrences
    languageBreakdown[review.language] = (languageBreakdown[review.language] || 0) + 1;

    // Count issues
    review.reviewResults.forEach((issue) => {
      if (severityBreakdown[issue.severity] !== undefined) {
        severityBreakdown[issue.severity]++;
      }
      if (categoryBreakdown[issue.category] !== undefined) {
        categoryBreakdown[issue.category]++;
      }
    });
  });

  return {
    totalReviews: reviews.length,
    averageRiskScore: Math.round(totalRiskScore / reviews.length),
    severityBreakdown,
    categoryBreakdown,
    languageBreakdown,
  };
};

module.exports = {
  createReview,
  getUserReviews,
  getReviewById,
  deleteReview,
  getReviewStatus,
  getReviewLogs,
  bookmarkReview,
  unbookmarkReview,
  getBookmarkedReviews,
  getUserStats,
};
