const http = require('http')
const fs = require('fs')
const serverUtils = require('./server_utils')

const commentsArray = []
const path = ''

const server = http.createServer((req, res) => {
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });


})

const port = 5000

server.listen(port, () => console.log(`Success: listening on port ${port}...`))