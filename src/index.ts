import connectDB from "./db.ts";
import app from "./app.ts";
import mongoose from 'mongoose';
import https from "https";
import fs from "fs";
import path from "path";

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

    const server = https.createServer(httpsOptions, app).listen(PORT, () => {
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
          throw error;
      }
    });

  } catch (error: any) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown logic
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Start the server
startServer();
