import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, initializeDatabase } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "HRMS API is running",
    timestamp: new Date().toISOString(),
    database: "MySQL",
  });
});

// Database test endpoint
app.get("/test-db", async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.status(200).json({
        status: "success",
        message: "Database connection successful",
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database test failed",
      error: error.message,
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "HRMS Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      database_test: "/test-db",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    console.log("🚀 Starting HRMS Backend Server...");
    console.log("=" * 50);

    // Test database connection
    console.log("\n📊 Testing Database Connection:");
    const dbConnected = await testConnection();

    if (dbConnected) {
      console.log("\n🏗️  Setting up database:");
      await initializeDatabase();
    } else {
      console.log(
        "\n⚠️  Database connection failed, but server will start anyway"
      );
      console.log(
        "   You can fix the database issue and test again via /test-db endpoint"
      );
    }

    // Start listening
    app.listen(PORT, () => {
      console.log("\n" + "=" * 50);
      console.log(`✅ HRMS API Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Database test: http://localhost:${PORT}/test-db`);
      console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log("=" * 50);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT. Graceful shutdown...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM. Graceful shutdown...");
  process.exit(0);
});

startServer();
