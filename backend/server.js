// Load environment variables first
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const express = require("express");

app.use(express.json());

// Handle Uncaught Exceptions (Synchronous errors during boot)
process.on("uncaughtException", (err) => {
  console.error(`[CRITICAL CRASH] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
const path = require("path");

app.use(express.static(
  path.join(__dirname, "../frontend/dist")
));

app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

// Establish MongoDB Connection
connectDB();

// Resolve execution port
const PORT = process.env.PORT || 5000;

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`[Server] AI Code Reviewer SaaS Server Online!`);
  console.log(`[Server] Running in Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Server] Listening on Port: ${PORT}`);
  console.log(`=================================================`);
});

// Handle Unhandled Promise Rejections (Asynchronous errors)
process.on("unhandledRejection", (err) => {
  console.error(`[CRITICAL CRASH] Unhandled Promise Rejection: ${err.message}`);
  console.error(err.stack);
  // Gracefully close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
