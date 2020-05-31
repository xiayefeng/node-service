#!/usr/bin/env node

// 引入相关模块
var http = require('http');
var WebSocket = require('ws');
var url = require('url');
var path = require('path');
var readStaticFile = require('./tools/readStaticFile');
var fileWatch = require('./tools/fileWatch')
// var io = require('socket.io')


var basePath = '/public'
// 搭建 HTTP 服务器
var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url);
    var urlPathname = urlObj.pathname;
    var filePathname = path.join(__dirname, basePath, urlPathname);
     // 获取请求 URL 的查询字符串解析成的对象
    var queryObj = urlObj.query;
    switch (urlPathname) {
      case '/':
      case '':
      case '/index':  
          readStaticFile(res, './'+ basePath +'/index.html');
          break
      case '/login':
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.write(JSON.stringify(queryObj))
        res.end()
        break
       default:
         readStaticFile(res, filePathname)
    }
    // 读取静态文件
   
});

const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});

fileWatch()
/* var socket = io(server)
socket.on('connection', (socket) => {
  console.log('a user connected');
  setTimeout(() => {
    socket.emit('message', '22333');
  }, 1000)
}) */
// 在 3000 端口监听请求
server.listen(3000, function() {
    console.log("服务器运行中.");
    console.log("正在监听 3000 端口:")
    console.log('server is running: http://localhost:3000')
})


