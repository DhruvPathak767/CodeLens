const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/**
 * @desc    Get dashboard metrics overview (totals, grade, risk score)
 * @route   GET /api/dashboard/overview
 * @access  Private
 */
const getOverview = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getOverview(req.user._id);

  return sendSuccess(res, 200, "Dashboard overview retrieved successfully", data);
});

/**
 * @desc    Get daily review creation activity over 30 days
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
const getActivity = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getActivity(req.user._id);

  return sendSuccess(res, 200, "Dashboard activity retrieved successfully", data);
});

/**
 * @desc    Get review count and risk score spread by language
 * @route   GET /api/dashboard/languages
 * @access  Private
 */
const getLanguages = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getLanguages(req.user._id);

  return sendSuccess(res, 200, "Dashboard language stats retrieved successfully", data);
});

/**
 * @desc    Get total count of Critical/Warning/Suggestion issues
 * @route   GET /api/dashboard/severity-breakdown
 * @access  Private
 */
const getSeverityBreakdown = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getSeverityBreakdown(req.user._id);

  return sendSuccess(res, 200, "Dashboard severity breakdown retrieved successfully", data);
});

/**
 * @desc    Get weekly average risk scores and issue counts
 * @route   GET /api/dashboard/trends
 * @access  Private
 */
const getTrends = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getTrends(req.user._id);

  return sendSuccess(res, 200, "Dashboard trends retrieved successfully", data);
});

module.exports = {
  getOverview,
  getActivity,
  getLanguages,
  getSeverityBreakdown,
  getTrends,
};
