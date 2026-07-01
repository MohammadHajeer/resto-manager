import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Routes } from "./routes/index.js";
import Cors from "cors";

const app = express();

app.use(Cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api", Routes);

app.use(errorHandler);

export { app };
