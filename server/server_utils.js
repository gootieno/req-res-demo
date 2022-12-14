const fs = require('fs')

const serverUtils = {
  parseReqBody: (encodedString) => {
    encodedString
      .split("&").map((keyValuePair) => keyValuePair.split("="))
      .map(([key, value]) => [key, value.replace(/\+/g, " ")])
      .map(([key, value]) => [key, decodeURIComponent(value)])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  },

  injectHtmlData: (html, tag, data) => {
    const regex = new RegExp(tag, "g")
    html = html.replace(regex, data)
    return injectedHtml
  },

  getFileText: (path) => {
    const fileText = fs.readFileSync(path, 'utf-8');
    return fileText
  },


}

module.exports = serverUtils