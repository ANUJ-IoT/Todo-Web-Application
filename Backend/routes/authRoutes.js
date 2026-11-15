import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

export default function authRoutes(db) {
  router.post("/login", (req, res) => {
    try {
      const { name, pass } = req.body;
      db.query(
        "SELECT * FROM user WHERE name = ?",
        [name],
        async (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          if (result.length === 0) {
            return res.status(401).json({ message: "Invalid Credentials." });
          }
          const isMatch = await bcrypt.compare(pass, result[0].pass);
          if (!isMatch)
            return res.status(400).json({ message: "Invalid Credential." });
          return res.status(200).json({ message: "Login Successful" });
        },
      );
    } catch (error) {}
  });

  // TODO: if the username already exist then invalid
  router.post("/register", (req, res) => {
    try {
      const { name, pass } = req.body;
      db.query(
        "SELECT id FROM user WHERE name = ?",
        [name],
        async (err, result) => {
          if (err) return res.status(501).json({ message: err.message });
          if (result.length >= 1) {
            return res.status(400).json({ message: "NAME TAKEN" });
          }
          const saltForPassword = 10;
          const hashedPassword = await bcrypt.hash(pass, saltForPassword);
          db.query(
            "INSERT INTO user (name, pass) VALUES (?,?)",
            [name, hashedPassword],
            (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.json({ message: "Registration Successful" });
            },
          );
        },
      );
    } catch (error) {}
  });

  return router;
}
