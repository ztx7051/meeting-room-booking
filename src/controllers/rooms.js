const roomService = require("../services/rooms");
const { success, fail } = require("../utils/response");
const z = require("zod");

const roomSchema = z.object({
  name: z.string().min(1).max(50),
  capacity: z.number().positive(),
  location: z.string().min(1).max(100),
});

exports.list = async (req, res) => {
  const rooms = await roomService.listRooms();
  res.json(success(rooms));
};

exports.listById = async (req, res) => {
  const room = await roomService.getRoomById(req.params.id);
  res.json(success(room));
};

exports.create = async (req, res) => {
  const result = roomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(fail(400, result.error));
  }
  const room = await roomService.createRooms({
    name: req.body.name,
    capacity: req.body.capacity,
    location: req.body.location,
  });
  res.status(201).json(success(room));
};

exports.update = async (req, res) => {
  const result = roomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(fail(400, result.error));
  }
  const room = await roomService.updateRooms({
    id: req.params.id,
    name: req.body.name,
    capacity: req.body.capacity,
    location: req.body.location,
  });
  if (room.code === 404) {
    return res.status(404).json(fail(404, "Room not found"));
  }
  res.json(success(room));
};

exports.delete = async (req, res) => {
  const result = await roomService.deleteRooms(req.params.id);
  if (result.code === 404) {
    return res.status(404).json(fail(404, "Room not found"));
  }
  res.json(success(result));
};
