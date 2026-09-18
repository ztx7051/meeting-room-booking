const { fail } = require("../utils/response");

module.exports = (req, res, next) => {
  res.status(404).json(fail(404,"请求的资源不存在"));
};
