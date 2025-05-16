import connectDB from "./db.js";
import app from "./app.js";
import mongoose from 'mongoose';
import https from "https";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const homeDir = process.env.HOME;
if (!homeDir) {
  console.error("HOME environment variable not set. Check Docker Compose environment section.");
  process.exit(1);
}
const keyPath = path.join(homeDir, "localhost-key.pem");
const certPath = path.join(homeDir, "localhost.pem");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error(`SSL certificate files not found in ${homeDir}. Check volume mounts and file paths.`);
  console.error(`Expected key at: ${keyPath}`);
  console.error(`Expected cert at: ${certPath}`);
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = https.createServer(httpsOptions, app);

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

    server.listen(PORT, () => {
      console.log(`> Secure server running on port ${PORT}`);
      console.log(`> Environment: ${process.env.NODE_ENV || 'not set'}`);
    });

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

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    // You might want to add logic here to close the Socket.io server
    // if you have access to the 'io' instance in this scope.
    // For now, closing the HTTP server will eventually close socket connections.

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
