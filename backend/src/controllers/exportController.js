const exportService = require("../services/exportService");
const logActivity = require("../helpers/activityLogger");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Export code review as downloadable JSON file
 * @route   GET /api/reviews/:id/export/json
 * @access  Private
 */
const exportJson = asyncHandler(async (req, res, next) => {
  const review = await exportService.getVerifiedReview(req.params.id, req.user._id);

  // Dynamically calculate and append Quality Score to the JSON export payload
  const qualityScore = Math.max(0, Math.round(100 - (review.riskScore ?? 0)));
  const reviewExportData = {
    ...review,
    qualityScore,
  };

  // Set response headers for file attachment download
  res.setHeader("Content-Disposition", `attachment; filename=review_${req.params.id}.json`);
  res.setHeader("Content-Type", "application/json");

  // Log action in telemetry system
  logActivity(req.user._id, "review_export_json", { reviewId: req.params.id });

  return res.status(200).send(JSON.stringify(reviewExportData, null, 2));
});

/**
 * @desc    Export code review as downloadable Markdown (.md) report
 * @route   GET /api/reviews/:id/export/markdown
 * @access  Private
 */
const exportMarkdown = asyncHandler(async (req, res, next) => {
  const { filename, markdown } = await exportService.exportToMarkdown(req.params.id, req.user._id);

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "text/markdown");

  // Log action
  logActivity(req.user._id, "review_export_markdown", { reviewId: req.params.id });

  return res.status(200).send(markdown);
});

/**
 * @desc    Export code review in print-ready HTML format (PDF-ready structure)
 * @route   GET /api/reviews/:id/export/pdf
 * @access  Private
 */
const exportPdf = asyncHandler(async (req, res, next) => {
  const html = await exportService.exportToPdfReady(req.params.id, req.user._id);

  res.setHeader("Content-Type", "text/html");

  // Log action
  logActivity(req.user._id, "review_export_pdf", { reviewId: req.params.id });

  return res.status(200).send(html);
});

module.exports = {
  exportJson,
  exportMarkdown,
  exportPdf,
};
