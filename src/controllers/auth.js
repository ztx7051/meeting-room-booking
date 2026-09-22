const { success, fail } = require("../utils/response");

const servicesAuth = require("../services/auth");

const z = require("zod");

const registerSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6),
});

exports.register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

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

  const auth = await servicesAuth.register(parsed.data);
  if (!auth) {
    return res.status(409).json(fail(409, "注册用户已存在"));
  }
  res.status(201).json(success(auth));
};

exports.login = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
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

  const loginResult = await servicesAuth.login(parsed.data);
  if (!loginResult) return res.status(401).json(fail(401, "用户名或密码错误"));

  res.json(success(loginResult));
};
