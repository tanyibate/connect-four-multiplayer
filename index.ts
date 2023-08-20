import { Socket } from "socket.io";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import router from "./routes";
import Room, { CustomSocket } from "./models/Room";

const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  /**
   * Gets fired when a user wants to get one room.
   *
   *
   */
  socket.on("get-room", (roomId, callback) => {
    const room = Room.getRoom(roomId);
    console.log(room);
    if (room) {
      callback({
        id: room.id,
        roomName: room.roomName,
        numOfPlayers: room.sockets.length,
        sockets: room.sockets.map((s: CustomSocket) => {
          return { id: s.id, username: s.username };
        }),
      });
    } else {
      callback(null);
    }
  });
  /**
   * Gets fired when a user wants to get all rooms.
   *
   *
   */
  socket.on("get-rooms", (_data, callback) => {
    const rooms = Room.getRooms();
    console.log(rooms);
    const roomResponse = rooms.map((room) => {
      return {
        id: room.id,
        name: room.roomName,
      };
    });
    callback(roomResponse);
  });
  /**
   * Gets fired when a user wants to create a new room.
   */
  socket.on("create-room", (roomName, callback) => {
    // have the socket join the room they've just created.
    const id = Room.createRoom([socket], roomName);
    callback(id);
  });

  /**
   * Gets fired when a player has joined a room.
   */
  socket.on("join-room", (roomId, callback) => {
    Room.joinRoom(socket, roomId);
    callback();
  });

  /**
   * Gets fired when a player leaves a room.
   */
  socket.on("leave-room", () => {
    Room.leaveRoom(socket);
  });

  /**
   * Gets fired when a player disconnects from the server.
   */
  socket.on("disconnect", () => {
    Room.leaveRoom(socket);
  });

  /**
   * Gets fired when a player has submitted their username.
   */
  socket.on("add-username", (username) => {
    Room.addUsername(socket, username);
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
