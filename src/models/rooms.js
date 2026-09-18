const db = require("./db");

exports.findAll = async () => {
  const [rows] = await db.execute("SELECT * FROM rooms");
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [id]);
  return rows[0] ?? null;
};

exports.insert = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO rooms (name, capacity, location) VALUES (?, ?, ?)",
    [data.name, data.capacity, data.location],
  );
  return result.insertId;
};

exports.update = async (data,id) => {
  const [{ affectedRows }] = await db.execute(
    "UPDATE rooms set name = ?, capacity = ?, location = ? WHERE id = ?",
    [data.name, data.capacity, data.location, id],
  );
  return affectedRows;
};

exports.delete = async (id) => {
  const [rows] = await db.execute("DELETE FROM rooms WHERE id = ?", [id]);
  return rows.affectedRows;
};
