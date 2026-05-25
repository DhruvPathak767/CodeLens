const fs = require("fs").promises;
const path = require("path");
const detectLanguage = require("../utils/detectLanguage");

/**
 * Reads uploaded files from disk, merges them with headers, compiles metadata,
 * and purges the temporary files from the uploads folder to prevent leaks.
 *
 * @param {Array<Object>} files - Array of Express Multer file objects
 * @returns {Promise<Object>} - Contains mergedCode, language, and fileMetadata
 */
const readUploadedFiles = async (files) => {
  if (!files || files.length === 0) {
    return {
      mergedCode: "",
      language: "Unknown",
      fileMetadata: [],
    };
  }

  const fileMetadata = [];
  const fileContents = [];
  let primaryLanguage = "";

  for (const file of files) {
    try {
      // Read file content from disk
      const content = await fs.readFile(file.path, "utf-8");
      const lang = detectLanguage(file.originalname, content);

      if (!primaryLanguage) {
        primaryLanguage = lang; // Set first file's language as primary
      }

      fileMetadata.push({
        fileName: file.originalname,
        sizeBytes: file.size,
        mimeType: file.mimetype,
        language: lang,
      });

      // Wrap code in structured comments for context
      const fileHeader = `/** ==========================================\n * FILE: ${file.originalname}\n * LANGUAGE: ${lang}\n * ========================================== */\n\n`;
      fileContents.push(fileHeader + content + "\n\n");
    } catch (error) {
      console.error(`[Pre-processing Error] Failed to read ${file.originalname}: ${error.message}`);
    } finally {
      // Async clean up of temp file on disk
      fs.unlink(file.path).catch((err) => {
        console.error(`[Clean-up Warning] Failed to delete temp file ${file.path}: ${err.message}`);
      });
    }
  }

  // Merge all file structures into a single string for Gemini processing
  const mergedCode = fileContents.join("\n");

  return {
    mergedCode,
    language: primaryLanguage || "Unknown",
    fileMetadata,
  };
};

module.exports = readUploadedFiles;
