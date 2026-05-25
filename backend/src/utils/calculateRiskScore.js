/**
 * Calculates a unified risk rating from 0 to 100 based on review issue severity.
 *
 * Weightings:
 * - Critical: 30 points
 * - Warning: 10 points
 * - Suggestion: 2 points
 *
 * @param {Array<Object>} issues - List of issues identified by Gemini
 * @returns {number} - Computed risk score capped at 100
 */
const calculateRiskScore = (issues) => {
  if (!issues || issues.length === 0) {
    return 0;
  }

  let totalScore = 0;

  issues.forEach((issue) => {
    switch (issue.severity) {
      case "Critical":
        totalScore += 30;
        break;
      case "Warning":
        totalScore += 10;
        break;
      case "Suggestion":
        totalScore += 2;
        break;
      default:
        totalScore += 1;
        break;
    }
  });

  // Cap the maximum risk score at 100 and ensure it is an integer
  return Math.min(totalScore, 100);
};

module.exports = calculateRiskScore;
