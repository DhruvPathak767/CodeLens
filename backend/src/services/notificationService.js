const Notification = require("../models/notificationModel");
const { ApiError } = require("../middleware/errorMiddleware");

/**
 * Service to retrieve all notifications for a specific user.
 */
const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

/**
 * Service to mark a specific notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } },
    { new: true }
  ).lean();

  if (!notification) {
    throw new ApiError(404, "Notification not found or unauthorized.");
  }

  return notification;
};

/**
 * Service to mark all notifications for a user as read.
 */
const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
  return { markedAllRead: true };
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
