require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(require("./src/middlewares/logger"));

app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/rooms", require("./src/routes/rooms")); // 挂路由
app.use("/api/users", require("./src/routes/users"));

app.get("/health", (req, res) => {
  const obj = {
    status: "ok",
  };
  res.json(obj);
});

app.use(require("./src/middlewares/notFound"));
app.use(require("./src/middlewares/error"));

app.listen(3000);
