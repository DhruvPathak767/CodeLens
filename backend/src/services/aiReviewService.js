const { GoogleGenerativeAI } = require("@google/generative-ai");
const getReviewPrompt = require("../prompts/reviewPrompt");
const { ApiError } = require("../middleware/errorMiddleware");

// Retrieve model selection from environment variables
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Robust JSON extraction utility.
 * Handles markdown fences, trailing strings, and unescaped quotes dynamically.
 *
 * @param {string} rawText - Raw response text from Gemini
 * @returns {Object} - Parsed JSON object
 */
const parseGeminiResponse = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid response format received from AI.");
  }

  let cleanText = rawText.trim();

  // 1. Strip away markdown formatting wrappers (```json ... ```)
  cleanText = cleanText.replace(/^```json\s*/i, "");
  cleanText = cleanText.replace(/^```\s*/i, "");
  cleanText = cleanText.replace(/```$/, "");
  cleanText = cleanText.trim();

  // 2. Slice text to capture only the first '{' and last '}' to prune trailing chatter
  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("[Parser Alert] Direct JSON parsing failed. Attempting regex repair on JSON string...");

    // Try repairing basic unescaped backslashes or trailing commas before giving up
    try {
      // Remove trailing commas in arrays/objects: ,} -> } and ,] -> ]
      let repaired = cleanText.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
      return JSON.parse(repaired);
    } catch (repairError) {
      console.error("[Parser Error] Regex repair failed. Triggering recovery fallback payload.", repairError);
      
      // Return structured fallback JSON so user gets their review even if JSON was corrupted
      return {
        summary: "We analyzed your code, but the AI's response format was slightly malformed. Here is the raw analysis extracted.",
        issues: [
          {
            severity: "Warning",
            category: "Best Practices",
            line: "Global",
            issue: "Review formatting parsing anomaly",
            explanation: `The code review analysis completed successfully, but the structured JSON output returned by the LLM had parsing issues: ${error.message}.`,
            fix: "Review raw code directly or re-run the review request.",
            optimizedCode: "// Raw analysis was preserved but could not be structured into issues.",
          },
        ],
      };
    }
  }
};

/**
 * Service to interface with Google Gemini AI API and generate the code review.
 *
 * @param {string} code - Original code paste or stitched file code
 * @param {string} language - Programming language identifier
 * @returns {Promise<Object>} - Contains summary, riskScore, and issues array
 */
const generateCodeReview = async (code, language) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      500,
      "Gemini API configuration is missing on the server. Please supply GEMINI_API_KEY in the environment variables."
    );
  }

  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure model with low temperature for high consistency and native JSON formatting
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.1, // Near-deterministic response consistency
        topP: 0.95,
        responseMimeType: "application/json"
      }
    });

    // Build the master prompt
    const prompt = getReviewPrompt(code, language);

    // Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error("Empty response received from Gemini API.");
    }

    // Parse response into structured JSON
    const parsedReview = parseGeminiResponse(responseText);

    // Ensure all critical fields exist and return
    return {
      summary: parsedReview.summary || "No review summary available.",
      issues: parsedReview.issues || [],
    };
  } catch (error) {
    console.error(`[Gemini API Error] Failed to generate code review: ${error.message}`);
    
    // Check for common error signatures (quota, invalid key, blocked request)
    if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
      throw new ApiError(401, "The provided Gemini API Key is invalid or expired. Please check server settings.");
    }
    if (error.status === 429 || error.message.includes("429") || error.message.includes("quota")) {
      throw new ApiError(429, "Gemini API rate limit or quota exceeded. Please try again later.");
    }

    throw new ApiError(502, `Gemini AI service failure: ${error.message}`);
  }
};

module.exports = {
  generateCodeReview,
};
