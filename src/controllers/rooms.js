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
  if (!room) {
    return res.status(404).json(fail(404, "Room not found"));
  }
  res.json(success(room));
};

exports.create = async (req, res) => {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json(
        fail(
          400,
          parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        ),
      );
  }
  const room = await roomService.createRooms(parsed.data);
  if (!room) {
    return res.status(409).json(fail(409, "同名会议室已存在"));
  }
  res.status(201).json(success(room));
};

exports.update = async (req, res) => {
  const result = roomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(fail(400, result.error));
  }
  const room = await roomService.updateRooms(result.data, req.params.id);
  if (!room) {
    return res.status(404).json(fail(404, "Room not found"));
  }
  res.json(success(room));
};

exports.delete = async (req, res) => {
  const result = await roomService.deleteRooms(req.params.id);
  if (result === null) return res.status(404).json(fail(404, "会议室不存在"));
  if (result === false)
    return res.status(409).json(fail(409, "该会议室下还有预约记录,无法删除"));
  res.json(success(result, "Room deleted successfully"));
};
