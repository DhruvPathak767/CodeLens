const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");
const { sendError } = require("./utils/apiResponse");

const app = express();

// 1. Security Headers (Helmet) - Configured with CSP rules to support Google Sign-in (GSI)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com/gsi/client"],
        "connect-src": ["'self'", "https://accounts.google.com/gsi/", "https://oauth2.googleapis.com"],
        "frame-src": ["'self'", "https://accounts.google.com/gsi/"],
        "style-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com/gsi/style", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "data:"],
        "img-src": ["'self'", "data:", "https://lh3.googleusercontent.com"],
      },
    },
  })
);


// 2. CORS configuration (Production-Ready)
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // Allow JWT token cookie transmission
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. HTTP Request Logging (Morgan)
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev")); // Colored concise logging for dev
}

// 4. Request Parsers
app.use(express.json({ limit: "10mb" })); // Supports code pastes up to 10MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Populates req.cookies

// 4.5. Request Security Hardening Filters (Anti-NoSQL & Anti-XSS)
const { mongoSanitizeMiddleware, xssSanitizeMiddleware } = require("./utils/security");
app.use(mongoSanitizeMiddleware);
app.use(xssSanitizeMiddleware);

// 5. Global Traffic Rate Limiting
app.use("/api", apiLimiter);

// Health Check API
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Import SaaS Extension Routers
const dashboardRoutes = require("./routes/dashboardRoutes");
const snippetRoutes = require("./routes/snippetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// 6. SaaS API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);

// 7. Serve built React frontend on the same Railway service.
const frontendPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 8. API Route Not Found (404) Handler
app.use("/api", (req, res, next) => {
  return sendError(res, 404, `Requested API path not found: ${req.originalUrl}`);
});

// 9. Global Centralized Error Middleware
app.use(errorHandler);

module.exports = app;
