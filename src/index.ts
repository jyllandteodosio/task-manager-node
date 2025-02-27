import express from "express";
import cors from "cors";  
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { connectDB, client } from "./db.ts";  
import tasksRouter from "./routes/tasks.ts";  
import usersRouter from "./routes/users.ts";  
import authRouter from "./routes/auth.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URI, 
      dbName: "task_manager",
      collectionName: "sessions", 
      ttl: 60 * 60
    }),
    cookie: { 
      secure: false, 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 
    },
  })
);

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

    app.use('/', authRouter);
    app.use('/tasks', tasksRouter);
    app.use('/users', usersRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error: any) {
    console.error("Error starting server:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await client.close(); 
  console.log("MongoDB Disconnected");
  process.exit(0);
});

startServer();
