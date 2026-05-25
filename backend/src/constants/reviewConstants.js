/**
 * SaaS Code Review System Constants
 */

const SEVERITIES = {
  CRITICAL: "Critical",
  WARNING: "Warning",
  SUGGESTION: "Suggestion",
};

const CATEGORIES = {
  SECURITY: "Security",
  PERFORMANCE: "Performance",
  BEST_PRACTICES: "Best Practices",
  SCALABILITY: "Scalability",
};

const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: "JavaScript",
  JAVASCRIPT_REACT: "JavaScript (React)",
  TYPESCRIPT: "TypeScript",
  TYPESCRIPT_REACT: "TypeScript (React)",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
};

const ALLOWED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp"];

module.exports = {
  SEVERITIES,
  CATEGORIES,
  SUPPORTED_LANGUAGES,
  ALLOWED_EXTENSIONS,
};
