import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { notes } from "./routes/notes.js";
import pool from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes(pool));
app.use("/notes", notes(pool));

export default app;
