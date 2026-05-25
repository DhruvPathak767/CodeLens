const mongoose = require("mongoose");
const dns = require("dns");

// Fallback Node.js DNS server setup to bypass virtual network SRV resolution bugs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  console.log("[System] Configured DNS resolution servers to Google Public DNS.");
} catch (dnsErr) {
  console.warn(`[System Warning] Failed to override DNS servers: ${dnsErr.message}`);
}

/**
 * Connects to MongoDB database using the environment variable MONGO_URI.
 * Includes robust connection event listeners and graceful error handling.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on("disconnected", () => {
  console.warn("[Database Warning] MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error(`[Database Error] MongoDB connection error: ${err.message}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("[Database] MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
