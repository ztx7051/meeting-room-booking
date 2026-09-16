const express = require("express");

const app = express();

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  console.log(`${req.method} ${req.url} ${duration}ms`);
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/health", (req, res) => {
  const obj = {
    status: "ok",
  };
  res.json(obj);
});

app.listen(3000);
