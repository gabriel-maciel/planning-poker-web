function logAndBroadcast(event, data, io, room = null) {
  console.log(`broadcast ${event} ${JSON.stringify(data)}`);
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
}

module.exports = {
  logAndBroadcast,
};
