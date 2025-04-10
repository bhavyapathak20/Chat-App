const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));


io.on('connection', (socket) => {
  let userName = '';

  socket.on('new-user', (name) => {
    userName = name;
    socket.broadcast.emit('user-joined', `${userName} joined the chat`);
  });

  socket.on('send-message', (message) => {
    io.emit('chat-message', { message, name: userName });
  });

  socket.on('disconnect', () => {
    if (userName) {
      io.emit('user-left', `${userName} left the chat`);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
