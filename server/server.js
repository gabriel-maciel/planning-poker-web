const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const RoomService = require('./services/roomService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

const roomService = new RoomService(io);

io.on('connection', (socket) => {
  socket.on('joinRoom', (room, playerName, callback) =>
    roomService.joinRoom(socket, room, playerName, callback),
  );

  socket.on('disconnect', () => roomService.disconnect(socket));

  socket.on('cardSelected', (room, data) =>
    roomService.cardSelected(room, data),
  );

  socket.on('revealCards', (room) => roomService.revealCards(room));

  socket.on('resetGame', (room) => roomService.resetGame(room));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
