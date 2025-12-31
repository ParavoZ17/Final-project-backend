import { Request, Response } from "express";
import * as chatService from "../services/chat.service.js";

export const createOrGetChat = async (req: Request, res: Response) => {
  const myId = req.user!._id.toString();
  const { userId } = req.body;

  const chat = await chatService.findOrCreateChat(myId, userId);
  res.json(chat);
};

export const getChats = async (req: Request, res: Response) => {
  const myId = req.user!._id.toString();
  const chats = await chatService.getUserChats(myId);
  res.json(chats);
};
