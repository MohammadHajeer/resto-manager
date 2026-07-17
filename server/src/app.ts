import cors, { type CorsOptions } from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Routes } from "./routes/index.js";

const app = express();

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ??
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allows Postman, health checks, and server-to-server requests.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Better Auth must stay before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", Routes);

app.use(errorHandler);

export { app };