module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "服务器内部错误" });
};
