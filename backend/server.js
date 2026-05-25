// Load environment variables
require("dotenv").config();

const express = require("express");

const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect MongoDB
connectDB();

// JSON Middleware
app.use(express.json());

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
