import express from "express";  
import cors from "cors";  
import { config } from "./config.ts";  
import { connectDB, client } from "./db.ts";  
import tasksRouter from "./routes/tasks.ts";  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await connectDB();

    app.use(
      cors({
        origin: 'http://localhost:4000',
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
      })
    );

    app.use('/tasks', tasksRouter);

    const PORT = config.server.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await client.close(); 
  console.log("🔌 MongoDB Disconnected");
  process.exit(0);
});

startServer();
