const fs = require('fs')
const homePagePath = "../client/index.html";
const commentsArray = []

const serverUtils = {
  parseReqBody: (encodedString) => {
    return encodedString
      .split("&").map((keyValuePair) => keyValuePair.split("="))
      .map(([key, value]) => [key, value.replace(/\+/g, " ")])
      .map(([key, value]) => [key, decodeURIComponent(value)])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  },
  injectHtmlData: (html, tags, data) => {
    for (const tag of tags) {
      const regex = new RegExp(tag, "g")
      html = html.replace(regex, data)
    }
    return injectedHtml
  },
  getFileText: (path) => {
    return fs.readFileSync(path, 'utf-8');
  },
  parseFilePath: (req) => {
    return '.' + req.url.split("/static")[1]
  },
  setContentType: (fileType) => {
    switch (fileType) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "css":
        return "text/css";
      case "js":
        return "text/javascript";
      default:
        return "text/plain";
    }
  }
}

let serverRouter = {
  'serveAsset': (req, res, assetPath) => {
    const fileType = assetPath.split('/')[1]
    const resBody = serverUtils.getFileText(assetPath)

    res.statusCode = 200;
    res.setHeader('Content-Type', serverUtils.setContentType(fileType));
    return res.end(resBody);
  },
  'GET': {
    'home': (req, res) => {
      const htmlPage = serverUtils.getFileText(homePagePath);
      const commentsList = commentsArray.map(comment => `<li>${comment}</li>`);
      const resBody = htmlPage.replace(/#{comments}/g, commentsList.join(""));

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(resBody);
    },
  },
  'POST': {
    'comments': (req, res) => {
      commentsArray.push(req.body.comment);

      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    }
  }
}

module.exports = { commentsArray, serverUtils, serverRouter }