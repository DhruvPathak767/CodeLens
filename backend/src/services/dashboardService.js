const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const logger = require("../utils/logger");

/**
 * Aggregates a comprehensive overview of user code reviews.
 *
 * @param {string} userId - User's MongoDB ID
 */
const getOverview = async (userId) => {
  logger.time("Dashboard.getOverview");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const stats = await Review.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        totalRiskScore: { $sum: "$riskScore" },
        avgRiskScore: { $avg: "$riskScore" },
        // Collects issues count by mapping size of the nested reviewResults arrays
        totalIssues: { $sum: { $size: "$reviewResults" } },
      },
    },
  ]);

  logger.timeEnd("Dashboard.getOverview");

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      totalIssues: 0,
      averageRiskScore: 0,
      systemStatus: "Excellent", // Default status
    };
  }

  const avgRisk = Math.round(stats[0].avgRiskScore);
  let systemStatus = "Safe";
  if (avgRisk >= 60) systemStatus = "Critical Hazard";
  else if (avgRisk >= 35) systemStatus = "Needs Attention";

  return {
    totalReviews: stats[0].totalReviews,
    totalIssues: stats[0].totalIssues,
    averageRiskScore: avgRisk,
    systemStatus,
  };
};

/**
 * Aggregates daily code review creations over the past 30 days.
 */
const getActivity = async (userId) => {
  logger.time("Dashboard.getActivity");
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activity = await Review.aggregate([
    {
      $match: {
        user: userObjectId,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  logger.timeEnd("Dashboard.getActivity");
  return activity.map((item) => ({
    date: item._id,
    count: item.count,
  }));
};

/**
 * Aggregates language usage spreads and average risk score of each.
 */
const getLanguages = async (userId) => {
  logger.time("Dashboard.getLanguages");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const languages = await Review.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$language",
        reviewCount: { $sum: 1 },
        averageRiskScore: { $avg: "$riskScore" },
      },
    },
    { $sort: { reviewCount: -1 } },
  ]);

  logger.timeEnd("Dashboard.getLanguages");
  return languages.map((item) => ({
    language: item._id,
    reviewCount: item.reviewCount,
    averageRiskScore: Math.round(item.averageRiskScore),
  }));
};

/**
 * Aggregates severity distributions across all issues.
 */
const getSeverityBreakdown = async (userId) => {
  logger.time("Dashboard.getSeverityBreakdown");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const breakdown = await Review.aggregate([
    { $match: { user: userObjectId } },
    { $unwind: "$reviewResults" },
    {
      $group: {
        _id: "$reviewResults.severity",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = { Critical: 0, Warning: 0, Suggestion: 0 };
  breakdown.forEach((item) => {
    if (stats[item._id] !== undefined) {
      stats[item._id] = item.count;
    }
  });

  logger.timeEnd("Dashboard.getSeverityBreakdown");
  return stats;
};

/**
 * Aggregates weekly average risk scores and issue volumes over time to plot chart lines.
 */
const getTrends = async (userId) => {
  logger.time("Dashboard.getTrends");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const trends = await Review.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        // Group by Year and Week Number
        _id: {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
        },
        avgRiskScore: { $avg: "$riskScore" },
        issuesCount: { $sum: { $size: "$reviewResults" } },
        reviewsCount: { $sum: 1 },
        startDate: { $min: "$createdAt" },
      },
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } },
  ]);

  logger.timeEnd("Dashboard.getTrends");
  return trends.map((item) => ({
    week: `W${item._id.week}-${item._id.year}`,
    reviewsCount: item.reviewsCount,
    issuesCount: item.issuesCount,
    avgRiskScore: Math.round(item.avgRiskScore),
    startDate: item.startDate,
  }));
};

module.exports = {
  getOverview,
  getActivity,
  getLanguages,
  getSeverityBreakdown,
  getTrends,
};
