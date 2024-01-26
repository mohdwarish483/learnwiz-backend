import express from "express";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Specify the origin of your frontend applications
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://learnwiz.netlify.app",
];

// using cross-origin resource sharing middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware to handle CORS preflight requests
app.options("/api/v1/login", (req, res) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", allowedOrigins.join(","));
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// Importing and using routes
import course from "./routes/CourseRoutes.js";
import users from "./routes/UserRoutes.js";
import payment from "./routes/PaymentRoutes.js";
import others from "./routes/otherRoutes.js";

app.use("/api/v1", course);
app.use("/api/v1", users);
app.use("/api/v1", payment);
app.use("/api/v1", others);

app.use(errorMiddleware);

export default app;
