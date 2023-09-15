import express from "express";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// creates an express application

const app = express();

// using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// using cross-origin resource sharing middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tiny-ruby-bear-sari.cyclic.cloud/api/v1",
    ],
    credentials: true,
  })
);

// Middleware to handle CORS preflight requests
app.options("/api/v1/login", (req, res) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// importing and using routes

import course from "./routes/CourseRoutes.js";
app.use("/api/v1", course);

import users from "./routes/UserRoutes.js";

app.use("/api/v1", users);

import payment from "./routes/PaymentRoutes.js";

app.use("/api/v1", payment);

import others from "./routes/otherRoutes.js";
app.use("/api/v1", others);

app.use(errorMiddleware);

export default app;
