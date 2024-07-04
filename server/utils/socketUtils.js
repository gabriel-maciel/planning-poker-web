function logAndBroadcast(event, data, io, room = null) {
  console.log(`broadcasting ${event} ${JSON.stringify(data)}`);
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
}

function getSelectionState(hiddenCards) {
  return Object.keys(hiddenCards).reduce((acc, key) => {
    acc[key] = '-';
    return acc;
  }, {});
}

module.exports = {
  logAndBroadcast,
  getSelectionState,
};
