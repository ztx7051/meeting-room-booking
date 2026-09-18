const { fail } = require("../utils/response");

module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json(fail(500, "服务器内部错误"));
};
