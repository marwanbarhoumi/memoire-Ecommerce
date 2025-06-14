const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/DB");
const userRouter = require("./routes/userRoute");

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Frontend dev
    'http://127.0.0.1:3000', // Alternative localhost
    process.env.FRONTEND_URL // From env if available
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use("/api", userRouter);

// Enhanced Health Check
app.get("/api/users/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "user-service",
    db: "connected",
    cors: "enabled",
    allowedOrigins: corsOptions.origin,
    timestamp: new Date().toISOString()
  });
});

// Enhanced Error Handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] User Service Error:`, err);

  const response = {
    success: false,
    error: err.message || "Internal Server Error"
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.details = {
      method: req.method,
      path: req.path,
      headers: req.headers
    };
  }

  res.status(err.status || 500).json(response);
});

// Server Configuration
const PORT = process.env.USER_PORT || 7004;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 User Service successfully started
  📌 Port: ${PORT}
  🌐 Base URL: http://${HOST}:${PORT}/api/users
  🔒 Auth URL: http://${HOST}:${PORT}/api/auth
  📁 Avatars: http://${HOST}:${PORT}/avatars/
  🔐 CORS Enabled for: ${corsOptions.origin.join(', ')}
  ⏰ Started: ${new Date().toLocaleString()}
  `);
});

// Enhanced process handlers
process.on("unhandledRejection", (err) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection:`, err);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log(`[${new Date().toISOString()}] SIGTERM received`);
  server.close(() => {
    console.log("Process terminated");
  });
});