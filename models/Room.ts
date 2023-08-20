import { UUID, randomUUID } from "crypto";
import { Socket } from "socket.io";

export interface CustomSocket extends Socket {
  username?: string;
  roomID?: UUID;
}

// Class that deals with creating and joining socket.io rooms
export const rooms = {};
class Room {
  sockets: CustomSocket[];
  id: UUID;
  roomName: string;

  constructor(sockets: CustomSocket[], roomName: string) {
    this.sockets = sockets;
    this.id = randomUUID();
    this.roomName = roomName;
  }

  // Create a new room
  static createRoom(sockets: CustomSocket[], roomName: string) {
    // random string generator
    const room = new Room(sockets, roomName);
    rooms[room.id] = room;
    return room.id;
  }

  // Leave an existing room
  static leaveRoom(socket: CustomSocket) {
    // Find the room the socket is in and remove it if it exists
    for (const id in rooms) {
      if (rooms[id].sockets?.includes(socket)) {
        rooms[id].sockets = rooms[id].sockets.filter(
          (s: CustomSocket) => s.id !== socket.id
        );
        socket.broadcast.to(id).emit("player-left");
        socket.leave(id);
        // If room is empty, delete it
        if (rooms[id].sockets.length === 0) {
          delete rooms[id];
        }
      }
    }
  }

  // Join an existing room if it exists and has less than 2 players
  static async joinRoom(socket: CustomSocket, id: UUID) {
    if (rooms[id] && rooms[id].sockets.length < 2) {
      socket.roomID = id;
      rooms[id].sockets.push(socket);
      await socket.join(id);
      socket.broadcast.emit("player-joined");
      return id;
    }
  }

  // Get a room by id
  static getRoom(id: UUID) {
    return rooms[id];
  }

  // Get all rooms that have one player in them
  static getRooms() {
    const rooms2 = [];
    for (const id in rooms) {
      if (rooms[id].sockets.length === 1) {
        rooms2.push(rooms[id]);
      }
    }
    return rooms2;
  }

  // Add a username to a socket
  static addUsername(socket: CustomSocket, username: string) {
    // Find the room the socket is in and add the username to it
    for (const id in rooms) {
      rooms[id].sockets = rooms[id].sockets.map((s: CustomSocket) => {
        if (s.id === socket.id) {
          s.username = username;
        }
        return s;
      });
    }
  }
}

export default Room;
