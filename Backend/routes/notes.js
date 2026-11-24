import express from "express";

export function notes(pool) {
  const router = express.Router();

  router.get("/:name", async (req, res) => {
    try {
      const name = req.params.name;

      const [result] = await pool.execute(
        "SELECT * FROM notes WHERE id = (SELECT id FROM user WHERE name = ?)",
        [name],
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.get("/all/:name", async (req, res) => {
    try {
      const name = req.params.name;

      const [result] = await pool.execute(
        "SELECT * FROM master_notes WHERE id = (SELECT id FROM user WHERE name = ?)",
        [name],
      );

      return res.status(200).json({ result });
    } catch (error) {
      console.error("Fetching all notes failed:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/shortNote", async (req, res) => {
    const { title, detail, name } = req.body;

    let connection;

    try {
      connection = await pool.getConnection();

      await connection.beginTransaction();

      const [users] = await connection.execute(
        "SELECT id FROM user WHERE name = ?",
        [name],
      );

      if (users.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "USER NOT FOUND!" });
      }

      const user_id = users[0].id;

      await connection.execute(
        "INSERT INTO notes (title, detail, id, cat) VALUES (?, ?, ?, 'short')",
        [title, detail, user_id],
      );

      await connection.execute(
        "INSERT INTO master_notes (title, detail, id, cat) VALUES (?, ?, ?, 'short')",
        [title, detail, user_id],
      );

      await connection.commit();

      return res.status(201).json({ message: "Inserted Successfully" });
    } catch (error) {
      if (connection) await connection.rollback();

      console.error("Short note insertion failed:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (connection) connection.release();
    }
  });

  router.post("/longNote", async (req, res) => {
    const { name, title, detail } = req.body;

    let connection;

    try {
      // CHANGED: Acquire a connection from the pool.
      connection = await pool.getConnection();

      // CHANGED: Start transaction for both INSERT operations.
      await connection.beginTransaction();

      const [users] = await connection.execute(
        "SELECT id FROM user WHERE name = ?",
        [name],
      );

      if (users.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "USER NOT FOUND!" });
      }

      const user_id = users[0].id;

      await connection.execute(
        "INSERT INTO notes (title, detail, id, cat) VALUES (?, ?, ?, 'long')",
        [title, detail, user_id],
      );

      await connection.execute(
        "INSERT INTO master_notes (title, detail, id, cat) VALUES (?, ?, ?, 'long')",
        [title, detail, user_id],
      );

      await connection.commit();

      return res.status(201).json({ message: "Inserted Successfully" });
    } catch (error) {
      if (connection) await connection.rollback();

      console.error("Long note insertion failed:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (connection) connection.release();
    }
  });

  router.delete("/", async (req, res) => {
    try {
      const { id } = req.body;

      const [result] = await pool.execute(
        "DELETE FROM notes WHERE noteId = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found." });
      }

      return res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
      console.error("Note deletion failed:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
}
