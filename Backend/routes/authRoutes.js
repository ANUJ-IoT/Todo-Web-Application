import express from "express";
import bcrypt from "bcrypt";

export default function authRoutes(pool) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { name, pass } = req.body;
    try {
      const [row] = await pool.query(
        "SELECT id, pass FROM user WHERE name = ?",
        [name],
      );

      if (row.length === 0) {
        return res.status(400).json({ message: "User Not Found." });
      }

      const isMatch = await bcrypt.compare(pass, row[0].pass);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials." });
      }

      return res.status(200).json({ message: "Valid Credentials" });
    } catch (error) {
      console.log("The server has failed due to some errors.", error.message);
      return res.status(500).json({ message: "The server has some error." });
    }
  });

  router.post("/register", async (req, res) => {
    let connection;
    const { name, pass } = req.body;
    let transactionStarted = false;
    try {
      const saltForPassword = 10;
      const hashedPassword = await bcrypt.hash(pass, saltForPassword);

      connection = await pool.getConnection();

      await connection.beginTransaction();
      transactionStarted = true;

      const [row] = await connection.execute(
        "SELECT id FROM user WHERE name = ?",
        [name],
      );

      if (row.length >= 1) {
        await connection.rollback();
        transactionStarted = false;
        return res.status(400).json({ message: "User Name already exits." });
      }

      await connection.execute("INSERT INTO user (name, pass) VALUES (?,?)", [
        name,
        hashedPassword,
      ]);

      await connection.commit();
      transactionStarted = false;
      return res.status(201).json({ message: "Registration Successfull." });
    } catch (error) {
      if (connection && beginTransaction) await connection.rollback();

      console.log(
        "The Registration has been failed due to server error.",
        error.message,
      );
      return res.status(500).json({ message: "The server got some error." });
    } finally {
      if (connection) connection.release();
    }
  });

  return router;
}
