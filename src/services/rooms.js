const roomModel = require("../models/rooms");

exports.listRooms = async () => {
  return await roomModel.findAll();
};

exports.getRoomById = async (id) => {
  return await roomModel.findById(id);
};

exports.createRooms = async (data) => {
  try {
    const insertId = await roomModel.insert(data);
    return await roomModel.findById(insertId); // 业务组合:插完查整行,住service
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return null; // 重名→null,让controller翻译成409
    throw err; // 不认识的错原样上抛→全局错误中间件→500
  }
};

exports.updateRooms = async (data, id) => {
  const affectedRows = await roomModel.update(data, id);
  if (affectedRows === 0) {
    return null;
  }
  return await roomModel.findById(id);
};

exports.deleteRooms = async (id) => {
  try {
    const affectedRows = await roomModel.delete(id);
    if (affectedRows === 0) {
      return null;
    }
    return true;
  } catch (error) {
    if (error.errno === 1451) return false // 名下有预约,删不动
    throw error;
  }
};
