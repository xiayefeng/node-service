#!/usr/bin/env node

// 引入相关模块
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const path = require('path');
const readStaticFile = require('./tools/readStaticFile');
const fileWatch = require('./tools/fileWatch')

const sourceSet = new Set() // 页面依赖收集器
const basePath = '/public' // 静态文件目录

// 搭建 HTTP 服务器
const server = http.createServer(function(req, res) {
    const urlObj = url.parse(req.url);
    const pathObj = path.parse(req.url)
    // console.log(pathObj)
    const urlPathname = urlObj.pathname;
    const filePathname = path.join(__dirname, basePath, urlPathname);
     // 获取请求 URL 的查询字符串解析成的对象
     const queryObj = urlObj.query;
    // 解析后对象的 ext 属性中保存着目标文件的后缀名
    const ext = pathObj.ext;
    if(ext === '.html' || (pathObj.dir === '/'&& pathObj.base=== '')) {
      sourceSet.clear() // 跳页面后清空依赖
      if((pathObj.dir === '/'&& pathObj.base=== '') || (pathObj.dir === '/'&& pathObj.base === 'index.html')){
        sourceSet.add('/index.html') // 访问首页时收集当前页面依赖文件
      } else {
        sourceSet.add(urlPathname) // 访问其他页面html时 收集依赖文件
      }
    } else {
      sourceSet.add(urlPathname) // 访问非html时，文件依赖收集
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
         break
    }
   
});


const sendMsg = function(ws){
    return function (msg) {
      ws.send(msg)
    }
}
let sendMethod = null
const wss = new WebSocket.Server({ server }); // 创建websocke服务

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) { // 监听客户端向服务发送消息
    console.log('received: %s', message);
  });
  sendMethod = sendMsg(ws)
  ws.send('something'); //websockt 连接后向客户端发送消息
});
const fileChange = function(path) {
  console.log(path)
  let str = path.replace(/\\/g, '/')
  str = '/' + str
  if(sourceSet.has(str)){
    sendMethod && sendMethod('update') // 依赖文件变化时向客户端推送消息
  }
}
fileWatch(fileChange)

// 在 3000 端口监听请求
server.listen(3000, function() {
    console.log("服务器运行中.");
    console.log("正在监听 3000 端口:")
    console.log('server is running: http://localhost:3000')
})


