import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Routes } from "./routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

//* Better Auth route must be BEFORE express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", Routes);

app.use(errorHandler);

export { app };
