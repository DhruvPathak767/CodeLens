const express = require("express");
const {
  getOverview,
  getActivity,
  getLanguages,
  getSeverityBreakdown,
  getTrends,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply JWT verification protect middleware to all dashboard analytics routes
router.use(protect);

router.get("/overview", getOverview);
router.get("/activity", getActivity);
router.get("/languages", getLanguages);
router.get("/severity-breakdown", getSeverityBreakdown);
router.get("/trends", getTrends);

module.exports = router;
