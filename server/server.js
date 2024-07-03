const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { logAndBroadcast } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

let players = {};
let selectedCards = {};
let hiddenCards = {};
let gameState = {
  revealed: false,
};

io.on('connection', (socket) => {
  logAndBroadcast('updatePlayers', players, io);
  logAndBroadcast('updateGameState', gameState, io);

  if (gameState.revealed) {
    logAndBroadcast('updateSelectedCards', selectedCards, io);
  } else {
    const selectionState = getSelectionState(hiddenCards);
    logAndBroadcast('updateSelectedCards', selectionState, io);
  }

  socket.on('newPlayer', (playerName, callback) => {
    console.log(`socket connected ${socket.id} playerName: ${playerName}`);
    if (typeof callback !== 'function') {
      callback = () => {};
    }
    if (Object.values(players).includes(playerName)) {
      callback({ success: false, message: 'Name already taken' });
    } else {
      players[socket.id] = playerName;
      logAndBroadcast('updatePlayers', players, io);
      callback({ success: true });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    const playerName = players[socket.id];
    delete players[socket.id];
    delete selectedCards[playerName];
    delete hiddenCards[playerName];
    logAndBroadcast('updatePlayers', players, io);
    logAndBroadcast(
      'updateSelectedCards',
      gameState.revealed ? selectedCards : getSelectionState(hiddenCards),
      io,
    );
  });

  socket.on('cardSelected', (data) => {
    console.log(
      `cardSelected received from ${socket.id} ${JSON.stringify(data)}`,
    );
    hiddenCards[data.playerName] = data.selectedCard;
    logAndBroadcast('cardSelected', data.playerName, io);
  });

  socket.on('revealCards', () => {
    console.log(`revealCards received from ${socket.id}`);
    gameState.revealed = true;
    selectedCards = { ...hiddenCards };
    logAndBroadcast('updateSelectedCards', selectedCards, io);
    logAndBroadcast('updateGameState', gameState, io);
  });

  socket.on('resetGame', () => {
    console.log(`resetGame received from ${socket.id}`);
    gameState.revealed = false;
    hiddenCards = {};
    selectedCards = {};
    logAndBroadcast('updateSelectedCards', selectedCards, io);
    logAndBroadcast('updateGameState', gameState, io);
  });

  function getSelectionState(hiddenCards) {
    return Object.keys(hiddenCards).reduce((acc, key) => {
      acc[key] = '-';
      return acc;
    }, {});
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
