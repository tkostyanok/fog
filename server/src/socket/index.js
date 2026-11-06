function registerSocketServer(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.emit("server:ready", {
      socketId: socket.id,
      ts: new Date().toISOString(),
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnected: ${socket.id}, reason=${reason}`);
    });
  });
}

module.exports = {
  registerSocketServer,
};
