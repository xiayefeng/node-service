// let sendMethod = null
function createWebsocket(server) {
	return new Promise((resolve, reject) => {
		const wss = new WebSocket.Server({ server }) // 创建websocke服务

		wss.on('connection', (ws) => {
			ws.on('message', function incoming(message) { // 监听客户端向服务发送消息
				console.log('received: %s', message)
			})
      // sendMethod = sendMsg(ws)
      
      ws.send('something') //websockt 连接后向客户端发送消息
      return resolve(ws)
    })
    wss.on('error', (err) => {
      reject(err)
    })
	})
}

module.exports = createWebsocket