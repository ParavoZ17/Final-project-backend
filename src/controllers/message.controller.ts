import { Request, Response } from "express";
import * as messageService from "../services/message.service.js";
import * as chatService from "../services/chat.service.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, recipientId, text } = req.body;
    const senderId = req.user!._id.toString();

    if (!recipientId && !chatId) {
      return res.status(400).json({ error: "recipientId or chatId is required" });
    }

    const chat =
      chatId || (await chatService.findOrCreateChat(senderId, recipientId))._id;

    const message = await messageService.createMessage({
      chatId: chat.toString(),
      sender: senderId,
      recipient: recipientId,
      text,
    });

    res.status(201).json({ chatId: chat, message });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    if (!chatId) return res.status(400).json({ error: "chatId is required" });

    const messages = await messageService.getMessagesByChatId(chatId);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
