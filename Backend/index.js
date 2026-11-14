import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { notes } from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASS,
  database: "notes",
});

db.connect((err) => {
  if (err) console.log("error", err);
  console.log("connected");
});

app.use("/auth", authRoutes(db));
app.use("/notes", notes(db));

export default app;
