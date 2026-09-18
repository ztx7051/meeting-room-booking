const roomModel = require("../models/rooms");

exports.listRooms = async () => {
  return await roomModel.findAll();
};

exports.getRoomById = async (id) => {
  return await roomModel.findSingle(id);
};

exports.createRooms = async (data) => {
  return await roomModel.create(data);
};

exports.updateRooms = async (data) => {
  return await roomModel.update(data);
};

exports.deleteRooms = async (id) => {
  return await roomModel.delete(id);
};
