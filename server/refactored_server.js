const http = require("http");
const { serverRouter, serverUtils: { parseReqBody, parseFilePath } }
  = require("./server_utils");
const port = 5000;

const server = http.createServer((req, res) => {
  let reqBody = "";
  req.on("data", (data) => reqBody += data);

  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) req.body = parseReqBody(reqBody)

    if (req.method === "GET" && req.url.startsWith("/static")) {
      const assetPath = parseFilePath(req)
      return serverRouter.serveAsset(req, res, assetPath)
    }

    if (req.method === "GET" && req.url === "/") {
      return serverRouter.GET.home(req, res)
    }

    if (req.method === "POST" && req.url === "/comments") {
      return serverRouter.POST.comments(req, res)
    }
  });
});

server.listen(port, () => console.log(`Success: listening on port ${port}...`));
