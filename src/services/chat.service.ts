import ChatModel, { IChat } from "../db/models/Chat.js";
import { Types } from "mongoose";

export const findOrCreateChat = async (userA: string, userB: string): Promise<IChat> => {
  // 1. Шукаємо існуючий чат
  const existingChat = await ChatModel.findOne({ 
    participants: { $all: [userA, userB] } 
  }).populate("participants", "username avatar");

  if (existingChat) {
    return existingChat;
  }

  // 2. Створюємо новий чат
  // Використовуємо generic <IChat>, щоб TS знав, який об'єкт ми створюємо
  const newChat = await ChatModel.create({
    participants: [new Types.ObjectId(userA), new Types.ObjectId(userB)],
  });

  // 3. Робимо populate. Використовуємо "!" оскільки ми впевнені, що чат щойно створений
  const populatedChat = await ChatModel.findById(newChat._id)
    .populate("participants", "username avatar");

  if (!populatedChat) {
    throw new Error("Failed to create or retrieve chat");
  }

  return populatedChat;
};

export const getUserChats = async (userId: string): Promise<IChat[]> => {
  return ChatModel.find({ participants: userId })
    .populate("participants", "username avatar")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "username avatar" },
    })
    .sort({ updatedAt: -1 })
    .exec(); 
};