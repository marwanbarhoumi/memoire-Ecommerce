const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/DB");
const userRouter = require("./routes/userRoute");

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials like cookies or headers
}));
 

app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", userRouter);

// Health Check Endpoint
app.get("/api/users/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "user-service",
    db: "connected",
    fileStorage: "enabled",
    auth: "active",
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("User Service Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Server Configuration
const PORT = process.env.USER_PORT || 7004;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`
  🚀 User Service successfully started
  📌 Port: ${PORT}
  🌐 Base URL: http://${HOST}:${PORT}/api/users
  🔒 Auth URL: http://${HOST}:${PORT}/api/auth
  📁 Avatars: http://${HOST}:${PORT}/avatars/
  ⏰ Started: ${new Date().toLocaleString()}
  `);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});