const usersServices = require("../services/users");
const z = require("zod");

const { success, fail } = require("../utils/response");

const userSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]),
});

exports.getAll = async (req, res) => {
  const result = await usersServices.getAll();
  res.json(success(result));
};

exports.getById = async (req, res) => {
  const result = await usersServices.getById(req.params.id);
  if (!result) {
    return res.status(404).json(fail(404, "用户未找到"));
  }
  res.json(success(result));
};

exports.addUser = async (req, res) => {
  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    return res
      .status(400)
      .json(
        fail(
          400,
          parse.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        ),
      );
  }
  const result = await usersServices.create(parse.data);

  if (!result) {
    return res.status(409).json(fail(409, "用户已存在"));
  }
  res.status(201).json(success(result));
};

exports.updateUser = async (req, res) => {
  const parsed = userSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(fail(400, parsed.error));
  }

  const result = await usersServices.update(parsed.data, req.params.id);
  res.json(success(result));
};

exports.deleteUser = async (req, res) => {
  const result = await usersServices.delete(req.params.id);

  if (result === null) return res.status(404).json(fail(404, "用户不存在"));
  if (result === false)
    return res.status(409).json(fail(409, "该用户名下还有预约记录,无法删除"));

  res.json(success(result, "删除成功"));
};
