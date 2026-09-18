const db = require("./db");

exports.findAll = async () => {
  const [rows] = await db.execute("SELECT * FROM rooms");
  return rows;
};

exports.findSingle = async (id) => {
  const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [id]);
  if (rows.length === 0) {
    return { code: 404, message: "Room not found" };
  }
  return rows[0];
};

exports.create = async (data) => {
  const [rows] = await db.execute(
    "INSERT INTO rooms (name,capacity,location) VALUES (?,?,?)",
    [data.name, data.capacity, data.location],
  );
  return { id: rows.insertId, ...rows };
};

exports.update = async (data) => {
  const [{ affectedRows }] = await db.execute(
    "UPDATE rooms set name = ?, capacity = ?, location = ? WHERE id = ?",
    [data.name, data.capacity, data.location, data.id],
  );
  if (affectedRows === 0) {
    return { code: 404, message: "Room not found" };
  }
  const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [
    data.id,
  ]);
  return { ...rows[0] };
};

exports.delete = async (id) => {
  const [rows] = await db.execute("DELETE FROM rooms WHERE id = ?", [id]);

  if (rows.affectedRows === 0) {
    return { code: 404, message: "Room not found" };
  }
  return { message: "Room deleted successfully" };
};
