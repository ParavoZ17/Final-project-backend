import { Response } from "express";
import * as commentService from "../services/comment.service.js";
import * as commentLikeService from "../services/commentLike.service.js";
import type { CommentRequest } from "../types/interfaces.js";

// Add a comment to a post
export const addCommentController = async (req: CommentRequest<{ id: string }>, res: Response) => {
  const userId = req.user!._id.toString();
  const postId = req.params.id;
  const { content } = req.body;

  if (!postId || !content) return res.status(400).json({ message: "Post ID and content required" });

  const comment = await commentService.addComment(userId, postId, content);
  res.status(201).json(comment);
};

export const getCommentsController = async (req: CommentRequest<{ id: string }>, res: Response) => {
  const postId = req.params.id;
  if (!postId) return res.status(400).json({ message: "Post ID required" });

  const comments = await commentService.getComments(postId, req.user?._id.toString());
  res.json(comments);
};


export const deleteCommentController = async (req: CommentRequest<{ commentId: string }>, res: Response) => {
  const userId = req.user!._id.toString();
  const commentId = req.params.commentId;

  if (!commentId) return res.status(400).json({ message: "Comment ID required" });

  const deleted = await commentService.deleteComment(commentId, userId);
  if (!deleted) return res.status(404).json({ message: "Comment not found" });

  res.json({ message: "Comment deleted" });
};


export const toggleCommentLikeController = async (req: CommentRequest<{ commentId: string }>, res: Response) => {
  const userId = req.user!._id.toString();
  const commentId = req.params.commentId;

  if (!commentId) return res.status(400).json({ message: "Comment ID required" });

  const result = await commentLikeService.toggleCommentLike(userId, commentId);
  res.json(result);
};
