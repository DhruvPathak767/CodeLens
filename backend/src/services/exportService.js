const Review = require("../models/reviewModel");
const { ApiError } = require("../middleware/errorMiddleware");

/**
 * Service helper to retrieve the target review and verify ownership.
 */
const getVerifiedReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, user: userId }).lean();
  if (!review) {
    throw new ApiError(404, "Review not found or you are not authorized to export it.");
  }
  return review;
};

/**
 * Compiles a beautifully formatted Markdown report of the code review.
 *
 * @param {string} reviewId - MongoDB Review ID
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Object>} - Contains filename and raw markdown text
 */
const exportToMarkdown = async (reviewId, userId) => {
  const review = await getVerifiedReview(reviewId, userId);

  const cleanProjectName = review.projectName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const filename = `${cleanProjectName}_code_review_${String(reviewId).substring(0, 6)}.md`;

  const qualityScore = Math.max(0, Math.round(100 - review.riskScore));
  let md = `# 🤖 AI Code Review Audit Report: ${review.projectName}\n\n`;
  md += `* **Language:** ${review.language}\n`;
  md += `* **Date of Review:** ${new Date(review.createdAt).toLocaleDateString()}\n`;
  md += `* **Quality Score:** \`${qualityScore}%\` (Risk Score: \`${review.riskScore}/100\`)\n\n`;

  // Risk Level Meter
  let riskLevel = "🟢 SAFE / LOW RISK";
  if (qualityScore < 50) riskLevel = "🔴 CRITICAL HAZARD / HIGH RISK";
  else if (qualityScore < 70) riskLevel = "🟡 NEEDS ATTENTION / MODERATE RISK";
  else if (qualityScore < 85) riskLevel = "🔵 GOOD / SECURE";
  md += `### 🛡️ Risk Assessment Status: **${riskLevel}**\n\n`;

  md += `## 📝 Executive Summary\n`;
  md += `${review.aiSummary}\n\n`;

  md += `## 📊 Vulnerability Breakdown\n\n`;
  md += `| Line | Category | Severity | Issue | \n`;
  md += `| --- | --- | --- | --- |\n`;

  review.reviewResults.forEach((issue) => {
    let severityIcon = "🟢";
    if (issue.severity === "Critical") severityIcon = "🔴";
    else if (issue.severity === "Warning") severityIcon = "🟡";

    md += `| \`${issue.line}\` | **${issue.category}** | ${severityIcon} ${issue.severity} | ${issue.issue} |\n`;
  });

  md += `\n---\n\n## 🔍 Deep-Dive Audited Issues & Proposed Fixes\n\n`;

  review.reviewResults.forEach((issue, index) => {
    let severityIcon = "🟢";
    if (issue.severity === "Critical") severityIcon = "🔴";
    else if (issue.severity === "Warning") severityIcon = "🟡";

    md += `### [Issue #${index + 1}] ${severityIcon} ${issue.issue}\n\n`;
    md += `* **Severity:** ${issue.severity}\n`;
    md += `* **Category:** ${issue.category}\n`;
    md += `* **Target Line:** \`${issue.line}\`\n\n`;

    md += `#### 🛑 Explanation\n`;
    md += `${issue.explanation}\n\n`;

    md += `#### 💡 Recommended Fix\n`;
    md += `${issue.fix}\n\n`;

    if (issue.optimizedCode && issue.optimizedCode.trim() !== "") {
      md += `#### 💻 Optimized Refactored Code\n`;
      md += `\`\`\`${review.language.split(" ")[0].toLowerCase()}\n`;
      md += `${issue.optimizedCode}\n`;
      md += `\`\`\`\n\n`;
    }

    md += `---\n\n`;
  });

  md += `*Report compiled by Antigravity Code Review SaaS Assistant.*`;

  return {
    filename,
    markdown: md,
  };
};

/**
 * Compiles a highly-styled, print-ready HTML structure of the code review.
 * Used as a PDF template on the frontend.
 *
 * @param {string} reviewId - MongoDB Review ID
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Object>} - Contains HTML report content
 */
const exportToPdfReady = async (reviewId, userId) => {
  const review = await getVerifiedReview(reviewId, userId);

  const qualityScore = Math.max(0, Math.round(100 - review.riskScore));

  let statusColor = "#10b981"; // Emerald/Green for Quality Score >= 85
  let statusLabel = "🟢 SAFE / EXCELLENT";
  if (qualityScore >= 85) {
    statusColor = "#10b981";
    statusLabel = "🟢 SAFE / EXCELLENT";
  } else if (qualityScore >= 70) {
    statusColor = "#3b82f6"; // Blue/Primary
    statusLabel = "🔵 GOOD / SECURE";
  } else if (qualityScore >= 50) {
    statusColor = "#f59e0b"; // Yellow/Amber
    statusLabel = "🟡 NEEDS ATTENTION / MODERATE RISK";
  } else {
    statusColor = "#ef4444"; // Red
    statusLabel = "🔴 CRITICAL HAZARD / HIGH RISK";
  }

  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>AI Code Review Report - ${review.projectName}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #1f2937;
        line-height: 1.6;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        border-bottom: 3px solid #374151;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .title {
        font-size: 28px;
        font-weight: 800;
        margin: 0 0 10px 0;
        color: #111827;
      }
      .meta {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      .risk-container {
        display: flex;
        align-items: center;
        margin-top: 15px;
        gap: 15px;
      }
      .risk-badge {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        background-color: ${statusColor};
        padding: 6px 15px;
        border-radius: 4px;
        display: inline-block;
      }
      .status-badge {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        background-color: #f3f4f6;
        padding: 6px 15px;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        display: inline-block;
      }
      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-top: 40px;
        margin-bottom: 15px;
        border-left: 5px solid #4f46e5;
        padding-left: 10px;
      }
      .summary-box {
        background-color: #f9fafb;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e5e7eb;
      }
      .vulnerability-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      .vulnerability-table th, .vulnerability-table td {
        border: 1px solid #e5e7eb;
        padding: 10px 12px;
        text-align: left;
        font-size: 14px;
      }
      .vulnerability-table th {
        background-color: #f3f4f6;
        font-weight: 700;
      }
      .badge {
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        display: inline-block;
      }
      .badge-Critical { background-color: #fee2e2; color: #991b1b; }
      .badge-Warning { background-color: #fef9c3; color: #854d0e; }
      .badge-Suggestion { background-color: #dbeafe; color: #1e40af; }
      
      .issue-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 25px;
        background-color: #ffffff;
        page-break-inside: avoid;
      }
      .issue-header {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 10px 0;
        color: #111827;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .code-block {
        background-color: #1e293b;
        color: #f8fafc;
        padding: 15px;
        border-radius: 6px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        overflow-x: auto;
        white-space: pre;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 50px;
        border-top: 1px solid #e5e7eb;
        padding-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1 class="title">${review.projectName} Code Review</h1>
      <div class="meta">
        <strong>Language:</strong> ${review.language} | 
        <strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}
      </div>
      <div class="risk-container">
        <div class="risk-badge">Quality Score: ${qualityScore}%</div>
        <div class="status-badge">Status: ${statusLabel}</div>
        <div style="font-size: 14px; color: #6b7280; margin-left: auto;">(Risk Score: ${review.riskScore}/100)</div>
      </div>
    </div>

    <div class="section-title">Executive Summary</div>
    <div class="summary-box">
      ${review.aiSummary}
    </div>

    <div class="section-title">Security & Vulnerability Audit Breakdown</div>
    <table class="vulnerability-table">
      <thead>
        <tr>
          <th>Line</th>
          <th>Category</th>
          <th>Severity</th>
          <th>Identified Issue</th>
        </tr>
      </thead>
      <tbody>
  `;

  review.reviewResults.forEach((issue) => {
    html += `
      <tr>
        <td><code>${issue.line}</code></td>
        <td><strong>${issue.category}</strong></td>
        <td><span class="badge badge-${issue.severity}">${issue.severity}</span></td>
        <td>${issue.issue}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <div class="section-title">Detailed Issue Reports & Optimizations</div>
  `;

  review.reviewResults.forEach((issue, index) => {
    html += `
      <div class="issue-card">
        <div class="issue-header">
          <span>#${index + 1} - ${issue.issue}</span>
          <span class="badge badge-${issue.severity}">${issue.severity}</span>
        </div>
        <div style="font-size: 13px; color: #4b5563; margin-bottom: 15px;">
          <strong>Category:</strong> ${issue.category} | <strong>Line:</strong> <code>${issue.line}</code>
        </div>
        
        <div style="font-weight: 700; font-size: 14px; margin-top: 10px;">🛑 Issue Impact & Explanation</div>
        <div style="font-size: 14px; margin-bottom: 15px;">${issue.explanation}</div>
        
        <div style="font-weight: 700; font-size: 14px; margin-top: 10px;">💡 Proposed Correction</div>
        <div style="font-size: 14px; margin-bottom: 15px;">${issue.fix}</div>
    `;

    if (issue.optimizedCode && issue.optimizedCode.trim() !== "") {
      // Escape HTML entities to prevent code breaking the output structure
      const escapedCode = issue.optimizedCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      html += `
        <div style="font-weight: 700; font-size: 14px; margin-top: 10px;">💻 Optimized Code Suggestion</div>
        <pre class="code-block">${escapedCode}</pre>
      `;
    }

    html += `</div>`;
  });

  html += `
    <div class="footer">
      Report generated by Antigravity AI Code Review Assistant SaaS Platform.
    </div>
  </body>
  </html>
  `;

  return html;
};

module.exports = {
  getVerifiedReview,
  exportToMarkdown,
  exportToPdfReady,
};
