const express = require("express");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply JWT verification protect middleware to all settings actions
router.use(protect);

// Theme/Preferences endpoints
router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
