const usersModels = require("../models/users");

exports.getAll = async () => {
  return await usersModels.getAll();
};

exports.getById = async (id) => {
  return await usersModels.getById(id);
};

exports.create = async (data) => {
  try {
    const id = await usersModels.insert(data);
    return await usersModels.getById(id);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return null;
    throw error;
  }
};

exports.update = async (data, id) => {
  const { affectedRows } = await usersModels.update(data, id);

  if (affectedRows === 0) {
    return null;
  }
  return usersModels.getById(id);
};

exports.delete = async (id) => {
  try {
    const { affectedRows } = await usersModels.delete(id);
    if (affectedRows === 0) {
      return null;
    }
    return true;
  } catch (error) {
    if (error.errno === 1451) return false; // 名下有预约,删不动
    throw error;
  }
};
