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

  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&") // [affiliate=nasa,query=Mars+Rover%21]
        .map((keyValuePair) => keyValuePair.split("=")) // [[affiliate,nasa],[query,Mars+Rover%21]]
        .map(([key, value]) => [key, value.replace(/\+/g, " ")]) // [[affiliate,nasa],[query,Mars Rover%21]]
        .map(([key, value]) => [key, decodeURIComponent(value)]) // [[affiliate,nasa],[query,Mars Rover!]]
        .reduce((acc, [key, value]) => {
          // [[affiliate,nasa],[query,Mars Rover!]]
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
      /*
      {affiliate: nasa, query: Mars Rover!}
        */
    }

    if (req.method === "GET" && req.url.startsWith("/static")) {
      const urlParts = req.url.split("/static");

      console.log("url parts ", urlParts);
      const staticPath = urlParts[1]; // /css/index.css

      console.log("static path ", staticPath);
      const resBody = fs.readFileSync("." + staticPath); // ./css/index.css

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/css");
      return res.end(resBody);
    }

    if (req.method === "GET" && req.url === "/") {
      const htmlPage = fs.readFileSync(path, "utf-8");

      const commentsList = commentsArray.map(
        (comment) => `<li>${comment}</li>`
      );

      const resBody = htmlPage.replace(/#{comments}/g, commentsList.join(""));

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(resBody);
    }

    if (req.method === "POST" && req.url === "/comments") {
      const { comment } = req.body;

      commentsArray.push(comment);

      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    }
  });
});

const port = 5000;

server.listen(port, () => console.log(`Success: listening on port ${port}...`));
