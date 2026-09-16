const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("hello");
  } else if (req.url === "/health") {
    const obj = {
      status: "ok",
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000);
