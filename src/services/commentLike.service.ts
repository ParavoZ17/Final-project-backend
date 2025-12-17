import { Types } from "mongoose";
import CommentLike from "../db/models/CommentLike.js";
import Comment from "../db/models/Comment.js";
import notificationService from "./notification.service.js";


export const toggleCommentLike = async (userId: string, commentId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const commentObjectId = new Types.ObjectId(commentId);

  const existing = await CommentLike.findOne({ user: userObjectId, comment: commentObjectId });

  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  }

  await CommentLike.create({ user: userObjectId, comment: commentObjectId });
  const comment = await Comment.findById(commentObjectId);

  if (comment) {

    await notificationService.createNotification(comment.user.toString(), userId, "like");
  }

  return { liked: true };
};
