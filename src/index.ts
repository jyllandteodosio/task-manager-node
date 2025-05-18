import connectDB from "./db.js";
import app from "./app.js";
import mongoose from "mongoose";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

let server: http.Server | https.Server;

const startServer = async () => {
  try {
    await connectDB();

    if (isProduction) {
      // --- Production Environment: Run as plain HTTP behind Nginx proxy ---
      console.log(`Running backend in production mode (HTTP) on port ${PORT}`);
      server = http.createServer(app);

    } else {
      // --- Development or Other Environments: Run with HTTPS (using local certs) ---
      console.log(`Running backend in development/non-production mode (HTTPS) on port ${PORT}`);

      const homeDir = process.env.HOME;
      if (!homeDir) {
        console.error("HOME environment variable not set. Ensure it's configured for development.");
        process.exit(1);
      }
      const keyPath = path.join(homeDir, "localhost-key.pem");
      const certPath = path.join(homeDir, "localhost.pem");

      if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.error(`SSL certificate files not found in ${homeDir} for development HTTPS.`);
        console.error(`Expected key at: ${keyPath}`);
        console.error(`Expected cert at: ${certPath}`);
        console.error("Ensure your development certificates are correctly volume mounted or placed in the expected HOME directory.");

        if (!isProduction) {
          process.exit(1);
        }
      }

      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };

      server = https.createServer(httpsOptions, app);

    }

    // --- Socket.IO Initialization (common for both HTTP and HTTPS) ---
    const io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'https://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true,
      }
    });
    console.log("> Socket.IO server initialized successfully.");

    app.set('socketio', io);

    io.on('connection', (socket) => {
      console.log('A user connected');

      const userId = socket.handshake.query.userId;
      socket.data.userId = userId;

      console.log(`Socket ${socket.id} is associated with user ${userId}`);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

      socket.on('joinList', (listId: string) => {
        socket.join(listId);
        console.log(`User ${userId} joined list room: ${listId}`);
      });

      socket.on('leaveList', (listId: string) => {
        socket.leave(listId);
        console.log(`User ${userId} left list room: ${listId}`);
      });

      socket.on('error', (error: any) => {
        console.error(`Socket error for user ${socket.id}:`, error);
      });
    });

    // --- Start the server (listen on the specified port) ---
    server.listen(PORT, () => {
      console.log(`> Secure server running on port ${PORT}`);
      console.log(`> Environment: ${process.env.NODE_ENV || 'not set'}`);
    });

    // --- Handle server errors ---
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          console.error("Server listen error:", error);
          throw error;
      }
    });

  } catch (error: any) {
    console.error("Error during server startup:", error.message);
    console.error("Full error details:", error);
    process.exit(1);
  }
};

// --- Graceful Shutdown ---
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    // Close the HTTP/HTTPS server
    if (server) {
      server.close(() => {
        console.log("HTTP/HTTPS server closed.");
        // After the server is closed, close other resources
        closeOtherResources();
      });
    } else {
      // If server wasn't created for some reason, just close other resources
      closeOtherResources();
    }

  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

const closeOtherResources = async () => {
  try {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }

    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("Error closing other resources:", error);
    process.exit(1); // Exit with error
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();