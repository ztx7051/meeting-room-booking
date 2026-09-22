const jwt = require("jsonwebtoken");
const { fail } = require("../utils/response");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer") ? header.slice(7) : null;

  if (!token) return res.status(401).json(fail(401, "未登录"));

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError"
        ? "登陆已过期，请重新登录"
        : "token 无效";
    res.status(401).json(fail(401, msg));
  }
};
