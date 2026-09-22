const db = require("./db");

exports.getAll = async () => {
  const [rows] = await db.execute(
    "SELECT id, username, role, created_at FROM users",
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, username, role, created_at FROM users WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

exports.findByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT id, username,password_hash, role, created_at FROM users WHERE username = ?",
    [username],
  );

  return rows[0] ?? null;
};

exports.insert = async (data) => {
  const [rows] = await db.execute(
    "INSERT INTO users (username,password_hash,role) VALUES(?,?,?)",
    [data.username, data.password, data.role],
  );

  return rows.insertId;
};

exports.update = async (data, id) => {
  const [rows] = await db.execute(
    "UPDATE users set username=?,password_hash=?,role=? WHERE id=?",
    [data.username, data.password, data.role, id],
  );

  return rows;
};

exports.delete = async (id) => {
  const [rows] = await db.execute("DELETE FROM users WHERE id=?", [id]);
  return rows;
};
