const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(function (req, res, next) {
  res.setHeader("access-control-allow-origin", "*");
  next();
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://example.com", "http://localhost:3000"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("input-change", (msg) => {
    socket.broadcast.emit("update-input", msg);
    console.log(msg);
  });

  socket.on("hello-world", (msg) => {
    console.log(msg);
  });

  socket.on("create-room", (room) => {
    console.log("room created");
    socket.join("123");
    socket.emit("room-created", "123");
  });

  socket.on("join-room", (room) => {
    socket.join("123");
    socket.to("123").emit("room-joined", "123 joined");
  });

  socket.on("get-rooms", () => {
    socket.emit("rooms", rooms);
  });

  socket.on("disconnect", () => {
    // socket.rooms.size === 0
  });
});

httpServer.listen(4000);
