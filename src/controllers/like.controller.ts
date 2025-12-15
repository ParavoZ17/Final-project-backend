import { Request, Response } from "express";
import * as likeService from "../services/like.service.js";
import { AuthRequest, Params } from "../types/interfaces.js";

export const toggleLikeController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  const userId = req.user?._id.toString();
  const postId = req.params.id;

  if (!userId || !postId) {
    return res
      .status(400)
      .json({ message: "User ID and Post ID required" });
  }

  const result = await likeService.toggleLike(userId, postId);
  res.json(result);
};

export const getLikesController = async (
  req: Request<Params>,
  res: Response
) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const likes = await likeService.getLikes(postId);
  res.json(likes);
};
