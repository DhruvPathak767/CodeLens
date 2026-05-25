const settingsService = require("../services/settingsService");
const logActivity = require("../helpers/activityLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const API_MESSAGES = require("../constants/apiMessages");

/**
 * @desc    Retrieve user theme and alert settings
 * @route   GET /api/settings
 * @access  Private
 */
const getSettings = asyncHandler(async (req, res, next) => {
  const settings = await settingsService.getUserSettings(req.user._id);

  return sendSuccess(res, 200, API_MESSAGES.SETTINGS.FETCHED, settings);
});

/**
 * @desc    Update theme, alerts, and model preferences
 * @route   PUT /api/settings
 * @access  Private
 */
const updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await settingsService.updateUserSettings(req.user._id, req.body);

  // Log activity
  logActivity(req.user._id, "settings_update", { theme: settings.theme, aiModel: settings.aiModel });

  return sendSuccess(res, 200, API_MESSAGES.SETTINGS.UPDATED, settings);
});

module.exports = {
  getSettings,
  updateSettings,
};
