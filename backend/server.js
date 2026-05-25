// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect MongoDB
connectDB();

// JSON Middleware
app.use(express.json());

// Frontend Build Path
const frontendPath = path.resolve(
  __dirname,
  "../frontend/dist"
);

// Serve React Frontend
app.use(express.static(frontendPath));

// React Catch-All Route. Express 5 no longer accepts a bare "*" path.
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`🚀 CodeLens AI Server Running`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`====================================`);
});

// Handle Rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);

  server.close(() => {
    process.exit(1);
  });
});
