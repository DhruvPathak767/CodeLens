const notificationService = require("../services/notificationService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/**
 * @desc    Retrieve all notifications for the user
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await notificationService.getUserNotifications(req.user._id);

  return sendSuccess(res, 200, "Notifications retrieved successfully", notifications);
});

/**
 * @desc    Mark a specific notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markNotificationRead = asyncHandler(async (req, res, next) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);

  return sendSuccess(res, 200, "Notification marked as read successfully", notification);
});

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsRead = asyncHandler(async (req, res, next) => {
  const result = await notificationService.markAllAsRead(req.user._id);

  return sendSuccess(res, 200, "All notifications marked as read successfully", result);
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
