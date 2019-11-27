let http = require('http')
let express = require('express')
let app = express()

// app.use('/public', express.static(__dirname + '/public'))
app.use(express.static('public'))

http.createServer(app).listen('3005', function(res) {
  console.log('启动服务器完成')
  console.log('server is running: http://localhost:3005')
})