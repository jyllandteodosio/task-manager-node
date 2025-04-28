import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';
import listsRouter from "./routes/lists.ts";
import tasksRouter from "./routes/tasks.ts";
import usersRouter from "./routes/users.ts";
import authRouter from "./routes/auth.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      // clientPromise: mongoose.connection.asPromise().then(conn => conn.getClient()), 
      client: mongoose.connection.getClient(),
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
  })
);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
);

// Routes
app.use('/', authRouter);
app.use('/lists', listsRouter);
app.use('/lists/:listId/tasks', tasksRouter);
app.use('/users', usersRouter);

export default app;
