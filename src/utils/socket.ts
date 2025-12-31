import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import { authenticateByToken } from "./authenticateByToken.js";
import { createMessage } from "../services/message.service.js";
import { UserDocument } from "../db/models/User.js";

interface ISocket extends Socket {
  user?: UserDocument;
}

let io: SocketIOServer | null = null;

export const initSocket = (server: http.Server): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket: ISocket, next) => {
    try {
      let rawToken = socket.handshake.auth?.token;

      if (!rawToken) {
        console.error("❌ Socket Auth: No token");
        return next(new Error("Token missing"));
      }

      if (typeof rawToken === 'object' && rawToken.token) {
        rawToken = rawToken.token;
      }

      const authHeader = typeof rawToken === 'string' && rawToken.startsWith("Bearer ") 
        ? rawToken 
        : `Bearer ${rawToken}`;

      const user = await authenticateByToken(authHeader);
      socket.user = user;
      next();
    } catch (err: any) {
      console.error("❌ Socket Auth Error:", err.message);
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket: ISocket) => {
    if (!socket.user) return;
    const userId = socket.user._id.toString();
    
    socket.join(userId);
    console.log(`🟢 Connected: ${socket.id} (User: ${userId})`);

    socket.on("join_chat", (chatId: string) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`📡 User ${userId} joined room: ${chatId}`);
    });

    socket.on("send_message", async (data) => {
      console.log("📥 Received send_message event with data:", data);

      const { chatId, recipientId, text } = data;

      if (!chatId || !text || !recipientId) {
        console.error("❌ Validation failed. Missing fields in data:", data);
        return;
      }

      try {
        // 1. Збереження в базу
        console.log("💾 Saving to database...");
        const message = await createMessage({
          chatId,
          sender: userId,
          recipient: recipientId,
          text,
        });

        // 2. Наповнення даними (populate)
        const populatedMessage = await message.populate([
          { path: "sender", select: "username avatar" },
          { path: "recipient", select: "username avatar" }
        ]);

        // Перетворюємо в чистий об'єкт для сокетів
        const messageToSend = populatedMessage.toObject();

        console.log(`📤 Message saved! ID: ${messageToSend._id}. Broadcasting to room: ${chatId}`);

        // 3. Відправка ВСІМ у кімнаті chatId
        // Використовуємо io.in(chatId).emit, щоб гарантовано відправити всім підключеним
        io?.in(chatId).emit("new_message", messageToSend);

      } catch (error: any) {
        console.error("❌ CRITICAL DB/SOCKET ERROR:", error.message);
        socket.emit("socket_error", { message: "Failed to process message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};