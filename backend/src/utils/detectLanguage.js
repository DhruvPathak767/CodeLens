const path = require("path");

const EXTENSION_MAP = {
  ".js": "JavaScript",
  ".jsx": "JavaScript (React)",
  ".ts": "TypeScript",
  ".tsx": "TypeScript (React)",
  ".py": "Python",
  ".java": "Java",
  ".cpp": "C++",
  ".h": "C++ Header",
};

/**
 * Heuristics to detect language from raw content strings
 */
const detectLanguageFromContent = (code) => {
  if (!code) return "Unknown";

  const sample = code.trim();

  // Heuristic patterns
  if (sample.includes("import React") || sample.includes("from 'react'") || sample.includes("className=")) {
    if (sample.includes("interface ") || sample.includes("type ")) {
      return "TypeScript (React)";
    }
    return "JavaScript (React)";
  }
  
  if (sample.includes("import ") && (sample.includes("const ") || sample.includes("let "))) {
    return "JavaScript";
  }

  if (sample.includes("def ") && (sample.includes(":") || sample.includes("import "))) {
    return "Python";
  }

  if (sample.includes("public class ") && sample.includes("public static void main")) {
    return "Java";
  }

  if (sample.includes("#include <") || sample.includes("std::cout")) {
    return "C++";
  }

  if (sample.includes("function ") || sample.includes("=>")) {
    return "JavaScript";
  }

  return "JavaScript"; // Safe industry fallback
};

/**
 * Main utility to detect programming language from a file name or code snippet content.
 *
 * @param {string} [fileName] - Name of the file (e.g., 'app.js')
 * @param {string} [codeContent] - Code body string
 * @returns {string} - Resolved language string
 */
const detectLanguage = (fileName, codeContent) => {
  if (fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (EXTENSION_MAP[ext]) {
      return EXTENSION_MAP[ext];
    }
  }

  return detectLanguageFromContent(codeContent);
};

module.exports = detectLanguage;
