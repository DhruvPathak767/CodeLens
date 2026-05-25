const crypto = require("crypto");
const logger = require("./logger");

// Derives a static 32-byte (256-bit) encryption key securely from JWT_SECRET or fallback
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "fallback_saas_reviewer_encryption_vector_key";
  return crypto.createHash("sha256").update(String(secret)).digest();
};

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES requires exactly 16 bytes IV

/**
 * Encrypts cleartext using AES-256-CBC.
 *
 * @param {string} text - Raw text to encrypt
 * @returns {string} - Combined hex representation of IV and ciphertext (iv:ciphertext)
 */
const encrypt = (text) => {
  if (!text) return "";

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    logger.error(`[Crypto Error] Encryption failed: ${error.message}`);
    throw new Error("Failed to encrypt sensitive data.");
  }
};

/**
 * Decrypts hex-payload back into cleartext.
 *
 * @param {string} encryptedText - Formatted payload (iv:ciphertext)
 * @returns {string} - Decrypted raw string
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return "";

  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted format string.");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    logger.error(`[Crypto Error] Decryption failed: ${error.message}`);
    throw new Error("Failed to decrypt sensitive data.");
  }
};

module.exports = {
  encrypt,
  decrypt,
};
