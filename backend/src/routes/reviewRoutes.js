const express = require("express");
const {
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
} = require("../controllers/reviewController");
const {
  exportJson,
  exportMarkdown,
  exportPdf,
} = require("../controllers/exportController");
const {
  createFeedback,
  getFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");
const { reviewLimiter } = require("../middleware/rateLimiter");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Apply JWT verification protect middleware to all review endpoints
router.use(protect);

// Code Review Actions
router.post("/analyze", reviewLimiter, analyzeCode);
router.post("/upload", upload.array("files", 10), reviewLimiter, uploadCode); // Supports up to 10 files in a single post

// Document Export Endpoints
router.get("/:id/export/json", exportJson);
router.get("/:id/export/markdown", exportMarkdown);
router.get("/:id/export/pdf", exportPdf);

// Review feedback rating configurations
router.post("/:id/feedback", createFeedback);
router.get("/:id/feedback", getFeedback);

// General Management & History Listing
router.get("/bookmarks", getBookmarks); // Must be defined BEFORE dynamic /:id to prevent string matching issues
router.get("/stats", getReviewStats); // Legacy stats endpoint
router.get("/", getReviews);

// Thread Status and Logs Polling endpoints
router.get("/:id/status", getStatus);
router.get("/:id/logs", getLogs);

// Bookmark Toggles
router.post("/:id/bookmark", addBookmark);
router.delete("/:id/bookmark", removeBookmark);

// Dynamic Document Detail CRUD
router.get("/:id", getReviewById);
router.delete("/:id", deleteReview);

module.exports = router;
