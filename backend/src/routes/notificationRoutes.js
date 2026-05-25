const express = require("express");
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply JWT verification protect middleware to all notification endpoints
router.use(protect);

router.get("/", getNotifications);
router.put("/read-all", markAllNotificationsRead); // Defined BEFORE parameterized /:id/read to prevent route conflicts
router.put("/:id/read", markNotificationRead);

module.exports = router;
