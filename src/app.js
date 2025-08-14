import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";


const app = express();

const allowedOrigins = [
  "https://bridge-ai-frontend-tan.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

import userRouter from "./routes/user.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import articlesRouter from "./routes/articles.routes.js";
import productHuntRouter from "./routes/producthunt.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chatbot", chatbotRouter);
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/products", productHuntRouter);

export { app };
