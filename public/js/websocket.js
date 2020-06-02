(function(win, doc){
  const socket = new WebSocket('ws://localhost:3000')

	// Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });
  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    if(event.data === 'update') {
      win.location.reload()
    }
  });

  socket.onerror = function(event) {
    console.error("WebSocket error observed:", event);
  };

  socket.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };
})(window, document)