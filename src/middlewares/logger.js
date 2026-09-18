module.exports = (req, res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  console.log(`${req.method} ${req.url} ${duration}ms`);
};
