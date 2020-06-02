#!/usr/bin/env node

// 引入相关模块
var http = require('http');
var WebSocket = require('ws');
var url = require('url');
var path = require('path');
var readStaticFile = require('./tools/readStaticFile');
var fileWatch = require('./tools/fileWatch')
// var io = require('socket.io')

var currentPage = []
var sourceSet = new Set()
var basePath = '/public'
// 搭建 HTTP 服务器
var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url);
    var pathObj = path.parse(req.url)
    // console.log(pathObj)
    var urlPathname = urlObj.pathname;
    var filePathname = path.join(__dirname, basePath, urlPathname);
     // 获取请求 URL 的查询字符串解析成的对象
    var queryObj = urlObj.query;
    // 解析后对象的 ext 属性中保存着目标文件的后缀名
    var ext = pathObj.ext;
    if(ext === '.html' || (pathObj.dir === '/'&& pathObj.base=== '')) {
      currentPage[0] = pathObj.base || 'index.html'
      sourceSet.clear()
      sourceSet.add('/index.html')
    }else {
      sourceSet.add(urlPathname)
    }
    
    switch (urlPathname) {
      case '/':
      case '':
      case '/index':  
          readStaticFile(res, '.'+ basePath +'/index.html');
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

setTimeout(() => {
  console.log(sourceSet)
}, 8500)
const sendMsg = function(ws){
    return function (msg) {
      ws.send(msg)
    }
}
var sendMethod = null
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  sendMethod = sendMsg(ws)
  ws.send('something');
});
const fileChange = function(path) {
  console.log(path)
  var str = path.replace(/\\/g, '/')
  str = '/' + str
  if(sourceSet.has(str)){
    sendMethod('update')
  }
}
fileWatch(fileChange)
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


