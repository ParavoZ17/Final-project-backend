import { Response } from "express";
import * as likeService from "../services/like.service.js";
import type { AuthRequest } from "../types/interfaces.js";

// Лайк/дизлайк поста
export const toggleLikeController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const postId = req.params.id;

  if (!userId || !postId)
    return res.status(400).json({ message: "User ID and Post ID required" });

  const result = await likeService.toggleLike(userId, postId);
  res.json(result);
};

// Отримати лайки поста + чи лайкнув поточний юзер
export const getLikesController = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  if (!postId) return res.status(400).json({ message: "Post ID is required" });

  const currentUserId = req.user?._id.toString();
  const likes = await likeService.getLikes(postId, currentUserId);
  res.json(likes);
};
