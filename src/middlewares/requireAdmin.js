const { fail } = require("../utils/response");

module.exports = (req, res, next) => {
  return req.user?.role === "admin"
    ? next()
    : res.status(403).json(fail(403, "需要管理员权限"));
};
