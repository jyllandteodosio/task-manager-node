const express = require("express");
const cors = require("cors");
const config = require("./config");
const { connectDB } = require("./db");
const tasksRouter = require("./routes/tasks");

const app = express();

// Middleware
app.use(express.json());

// Start Server Function
const startServer = async () => {
  // Connect to DB
  await connectDB();

  // Allow CORS
  app.use(cors({
    origin: 'http://localhost:4000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));

  // Import API routes
  app.use('/tasks', tasksRouter)

  const PORT = config.server.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

// Graceful Shutdown (Close MongoDB Connection)
process.on("SIGINT", async () => {
  console.log("\n Shutting down gracefully...");
  await client.close();
  console.log("🔌 MongoDB Disconnected");
  process.exit(0);
});

// Start Application
startServer();


