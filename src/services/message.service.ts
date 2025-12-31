import Message, { IMessage } from "../db/models/Message.js";
import Chat from "../db/models/Chat.js";

export const createMessage = async ({
  chatId,
  sender,
  recipient,
  text,
}: {
  chatId: string;
  sender: string;
  recipient: string;
  text: string;
}): Promise<IMessage> => {
  // 1. Створюємо запис у базі
  const message = await Message.create({
    chatId,
    sender,
    recipient,
    text,
    read: false,
  });

  // 2. Оновлюємо посилання на останнє повідомлення в моделі чату
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
  });

  // 3. Повертаємо повідомлення з підтягнутими даними юзерів (username, avatar)
  // Використовуємо execPopulate() або просто populate() залежно від версії Mongoose
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "username avatar")
    .populate("recipient", "username avatar");

  if (!populatedMessage) {
      throw new Error("Failed to populate message after creation");
  }

  return populatedMessage;
};

export const getMessagesByChatId = async (chatId: string) => {
  if (!chatId) throw new Error("chatId is required");

  return Message.find({ chatId })
    .sort({ createdAt: 1 })
    .populate("sender", "username avatar")
    .populate("recipient", "username avatar");
};