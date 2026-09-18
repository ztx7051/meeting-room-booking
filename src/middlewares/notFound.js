module.exports = (req, res, next) => {
  res.status(404).json({ error: "请求的资源不存在" });
};
