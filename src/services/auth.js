const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);

  try {
    const id = await userModel.insert({
      username: data.username,
      password: hash,
      role: "user",
    });

    return await userModel.getById(id);
  } catch (error) {
    if (error.errno === 1062) return null; // 重名
    throw error;
  }
};

exports.login = async (data) => {
  const user = await userModel.findByUsername(data.username);
  if (!user) return null;
  const ok = await bcrypt.compare(data.password, user.password_hash);
  if (!ok) return null;
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );
  return { token };
};
