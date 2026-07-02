import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Routes } from "./routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

//* Better Auth route must be BEFORE express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", Routes);

app.use(errorHandler);

export { app };
