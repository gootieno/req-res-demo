const http = require("http");
const fs = require("fs");
const serverUtils = require("./server_utils");

const commentsArray = [];
const path = "../client/index.html";

const server = http.createServer((req, res) => {
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  if (req.method === "GET" && req.url.startsWith("/static")) {
    const urlParts = req.url.split("/static");

    const staticPath = urlParts[1];

    const resBody = fs.readFileSync("./" + staticPath);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/css");
    return res.end(resBody);
  }

  if (req.method === "GET" && req.url === "/") {
    const htmlPage = fs.readFileSync(path, "utf-8");

    let resBody = htmlPage.replace("#{comments}", commentsArray);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    return res.end(resBody);
  }
});

const port = 5000;

server.listen(port, () => console.log(`Success: listening on port ${port}...`));
