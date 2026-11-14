import express from "express";

const router = express.Router();

export function notes(db) {
  router.get("/:name", (req, res) => {
    try {
      const name = req.params.name;
      db.query(
        "SELECT * FROM notes WHERE id = (SELECT id FROM user WHERE name = ? )",
        [name],
        (err, result) => {
          if (err) return res.status(500).json({ message: err.message });
          if (result.length === 0)
            return res.status(404).json({ message: "No Notes Found." });
          return res.status(200).json({ result });
        },
      );
    } catch (error) {}
  });

  router.get("/all/:name", (req, res) => {
    try {
      const name = req.params.name;
      db.query(
        "SELECT * FROM master_notes WHERE id = (SELECT id FROM user WHERE name = ? )",
        [name],
        (err, result) => {
          if (err) return res.status(500).json({ message: err.message });
          if (result.length === 0)
            return res.status(404).json({ message: "No Notes Found." });
          return res.status(200).json({ result });
        },
      );
    } catch (error) {}
  });

  router.post("/shortNote", (req, res) => {
    try {
      const { title, detail, name } = req.body;
      db.query("SELECT id FROM user WHERE name = ?", [name], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.length === 0)
          return res.status(404).json({ message: "USER NOT FOUND!" });

        const user_id = result[0].id;

        db.query(
          "INSERT INTO notes (title, detail, id, cat) VALUES (?,?,?, 'short')",
          [title, detail, user_id],
          (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query(
              "INSERT INTO master_notes (title, detail, id , cat) VALUES (?,?,?,'short')",
              [title, detail, user_id],
              (err, result) => {
                if (err) return res.status(500).json({ message: err.message });
              },
            );
            return res.json({ message: "Inserted Successfully" });
          },
        );
      });
    } catch (error) {}
  });

  router.post("/longNote", (req, res) => {
    try {
      const { name, title, detail } = req.body;
      db.query("SELECT id FROM user WHERE name = ?", [name], (err, result) => {
        if (err) return res.status(500).json({ message: err.json });
        if (result.length === 0) {
          return res.status(400).json({ message: "USER NOT FOUND!" });
        }
        const user_id = result[0].id;

        db.query(
          "INSERT INTO notes (title, detail, id, cat) VALUES (?,?,?, 'long')",
          [title, detail, user_id],
          (err, reslut) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query(
              "INSERT INTO master_notes (title, detail, id , cat) VALUES (?,?,?,'long')",
              [title, detail, user_id],
              (err, result) => {
                if (err) return res.status(500).json({ message: err.message });
              },
            );
            return res.json({ message: "Inserted Successfully" });
          },
        );
      });
    } catch (error) {}
  });

  router.delete("/", (req, res) => {
    try {
      const { id } = req.body;
      db.query("DELETE FROM notes WHERE noteId = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        return res.status(200).json({ message: "Deleted Successfully" });
      });
    } catch (error) {}
  });

  return router;
}
