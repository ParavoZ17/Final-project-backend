import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";

let io: SocketIOServer;

export const initSocket = (server: http.Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket & { userId?: string }) => {
    console.log("New user connected:", socket.id);

    socket.on("register", (userId: string) => {
      socket.userId = userId;
      socket.join(userId); 
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO is not initialized!");
  return io;
};
