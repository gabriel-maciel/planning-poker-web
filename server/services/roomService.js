const { logAndBroadcast, getSelectionState } = require('../utils/socketUtils');

class RoomService {
  constructor(io) {
    this.io = io;
    this.rooms = {};
  }

  joinRoom(socket, room, playerName, callback) {
    console.log(
      `socket connected ${socket.id} playerName: ${playerName} joined room: ${room}`,
    );

    if (!this.rooms[room]) {
      this.rooms[room] = {
        players: {},
        selectedCards: {},
        hiddenCards: {},
        gameState: { revealed: false },
      };
    }

    if (Object.values(this.rooms[room].players).includes(playerName)) {
      callback({ success: false, message: 'Name already taken in this room' });
    } else {
      socket.join(room);
      this.rooms[room].players[socket.id] = playerName;
      logAndBroadcast('updatePlayers', this.rooms[room].players, this.io, room);
      if (this.rooms[room].gameState.revealed) {
        socket.emit('updateSelectedCards', this.rooms[room].selectedCards);
      } else {
        const selectionState = getSelectionState(this.rooms[room].hiddenCards);
        socket.emit('updateSelectedCards', selectionState);
      }
      socket.emit('updateGameState', this.rooms[room].gameState);
      callback({ success: true });
    }
  }

  disconnect(socket) {
    for (let room in this.rooms) {
      if (this.rooms[room].players[socket.id]) {
        const playerName = this.rooms[room].players[socket.id];
        delete this.rooms[room].players[socket.id];
        delete this.rooms[room].selectedCards[playerName];
        delete this.rooms[room].hiddenCards[playerName];
        logAndBroadcast(
          'updatePlayers',
          this.rooms[room].players,
          this.io,
          room,
        );
        logAndBroadcast(
          'updateSelectedCards',
          this.rooms[room].gameState.revealed
            ? this.rooms[room].selectedCards
            : getSelectionState(this.rooms[room].hiddenCards),
          this.io,
          room,
        );

        if (Object.keys(this.rooms[room].players).length === 0) {
          delete this.rooms[room];
          console.log(`Room ${room} deleted as it has no remaining players`);
        }

        break;
      }
    }
  }

  cardSelected(room, data) {
    console.log(
      `cardSelected received from ${data.playerId} in room ${room} ${JSON.stringify(data)}`,
    );
    this.rooms[room].hiddenCards[data.playerName] = data.selectedCard;
    logAndBroadcast('cardSelected', data.playerName, this.io, room);
  }

  revealCards(room) {
    console.log(`revealCards received in room ${room}`);
    this.rooms[room].gameState.revealed = true;
    this.rooms[room].selectedCards = { ...this.rooms[room].hiddenCards };
    logAndBroadcast(
      'updateSelectedCards',
      this.rooms[room].selectedCards,
      this.io,
      room,
    );
    logAndBroadcast(
      'updateGameState',
      this.rooms[room].gameState,
      this.io,
      room,
    );
  }

  resetGame(room) {
    console.log(`resetGame received in room ${room}`);
    this.rooms[room].gameState.revealed = false;
    this.rooms[room].hiddenCards = {};
    this.rooms[room].selectedCards = {};
    logAndBroadcast(
      'updateSelectedCards',
      this.rooms[room].selectedCards,
      this.io,
      room,
    );
    logAndBroadcast(
      'updateGameState',
      this.rooms[room].gameState,
      this.io,
      room,
    );
  }

  getAllRoomsInfo() {
    return this.rooms;
  }
}

module.exports = RoomService;
