import express from "express";
import cors from "cors";  
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import listsRouter from "./routes/lists.ts";  
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
      secure: true, 
      httpOnly: true, 
			sameSite: "none",
			domain: "localhost",
      maxAge: 1000 * 60 * 60 * 24 
    },
  })
);

app.use(
	cors({
		origin: 'https://localhost:3000',
		methods: 'GET,POST,PUT,DELETE',
		allowedHeaders: 'Content-Type,Authorization',
		credentials: true,
	})
);

app.use('/', authRouter);
app.use('/lists', listsRouter);
app.use('/', tasksRouter);
app.use('/users', usersRouter);

export default app;
