const http = require("http");
const { Server } = require("socket.io");
const { createApp } = require("./app");
const { registerSocketServer } = require("./socket");

const PORT = Number(process.env.PORT || 4000);

const app = createApp();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocketServer(io);

httpServer.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] health endpoint: http://localhost:${PORT}/health`);
});
