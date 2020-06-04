(function(win, doc){
  var host = location.host // 获取服务器主机地址
  const socket = new WebSocket('ws://' + host) // 新建 websocket 连接

	// Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!'); // 向服务器发送消息
  });
  // Listen for messages
  socket.addEventListener('message', function (event) { // 监听服务发送的消息
    console.log('Message from server ', event.data);
    if(event.data === 'update') {
      win.location.reload(true) // 强制刷新
    }
  });

  socket.onerror = function(event) {
    console.error("WebSocket error observed:", event);
  };

  socket.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };
})(window, document)