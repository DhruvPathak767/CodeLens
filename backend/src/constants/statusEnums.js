/**
 * SaaS Code Review Processing Stages
 */
const STATUS_TYPES = {
  QUEUED: "queued",
  ANALYZING: "analyzing",
  SECURITY_SCAN: "security_scan",
  PERFORMANCE_ANALYSIS: "performance_analysis",
  SCALABILITY_CHECK: "scalability_check",
  GENERATING_FIXES: "generating_fixes",
  COMPLETED: "completed",
  FAILED: "failed",
};

module.exports = STATUS_TYPES;
