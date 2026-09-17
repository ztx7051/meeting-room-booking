const express = require("express");
const db = require("./db");
const app = express();

function errorFn(error, res) {
  console.error(error);
  res.status(500).json({ error: "服务器内部错误" });
}

app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  console.log(`${req.method} ${req.url} ${duration}ms`);
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/health", (req, res) => {
  const obj = {
    status: "ok",
  };
  res.json(obj);
});

app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM rooms");
    res.json(rows);
  } catch (error) {
    errorFn(error, res);
  }
});

app.get("/api/rooms/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    errorFn(error, res);
  }
});

app.post("/api/rooms", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "INSERT INTO rooms (name,capacity,location) VALUES (?,?,?)",
      [req.body.name, req.body.capacity, req.body.location],
    );
    res.status(201).json({ id: rows.insertId, ...req.body });
  } catch (error) {
    errorFn(error, res);
  }
});

app.put("/api/rooms/:id", async (req, res) => {
  try {
    const [{ affectedRows }] = await db.execute(
      "UPDATE rooms set name = ?, capacity = ?, location = ? WHERE id = ?",
      [req.body.name, req.body.capacity, req.body.location, req.params.id],
    );
    if (affectedRows === 0) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ ...rows[0] });
  } catch (error) {
    errorFn(error, res);
  }
});

app.delete("/api/rooms/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("DELETE FROM rooms WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.affectedRows === 0) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    errorFn(error, res);
  }
});

app.listen(3000);
