import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';
import listsRouter from "./routes/lists.js";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import passport from "passport";
import "./config/passport-setup.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);

// Session Configuration
app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io/')) {
    return next();
  }

  session({
    secret: process.env.SESSION_SECRET || "fallback-supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.COOKIE_DOMAIN || 'taskaru.jyllandteodosio.dev',
    },
  })(req, res, next);
});

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// CORS Configuration
app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io/')) {
    return next();
  }
  cors({
    origin: process.env.CORS_ORIGIN || 'https://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })(req, res, next);
});

// Routes
app.use('/', authRouter);
app.use('/lists', listsRouter);
app.use('/lists', tasksRouter);
app.use('/users', usersRouter);

export default app;
