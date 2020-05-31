#!/usr/bin/env node

// 引入相关模块
var WebSocketServer = require('websocket').server;
var http = require('http');
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

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  
  var connection = request.accept('http', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log('Received Message: ' + message.utf8Data);
          connection.sendUTF(message.utf8Data);
      }
      else if (message.type === 'binary') {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          connection.sendBytes(message.binaryData);
      }
  });
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
