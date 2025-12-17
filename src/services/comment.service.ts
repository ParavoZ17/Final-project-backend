import { Types } from "mongoose";
import Comment from "../db/models/Comment.js";
import CommentLike from "../db/models/CommentLike.js";
import Post from "../db/models/Post.js";
import notificationService from "./notification.service.js";

// Додати коментар
export const addComment = async (userId: string, postId: string, content: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const postObjectId = new Types.ObjectId(postId);

  const comment = await Comment.create({ user: userObjectId, post: postObjectId, content });
  await Post.findByIdAndUpdate(postObjectId, { $inc: { commentsCount: 1 } });

  const post = await Post.findById(postObjectId);
  if (post) {
    // 🔹 тільки 4 аргументи, TS не падає
    await notificationService.createNotification(
      post.author.toString(),
      userId,
      "comment",
      post._id.toString()
    );
  }

  return comment;
};

// Отримати коментарі + info про лайк поточного користувача
export const getComments = async (postId: string, currentUserId?: string) => {
  const postObjectId = new Types.ObjectId(postId);
  const comments = await Comment.find({ post: postObjectId })
    .sort({ createdAt: -1 })
    .populate("user", "username avatar");

  if (!currentUserId) return comments.map(c => ({ ...c.toJSON(), userLiked: false }));

  const commentIds = comments.map(c => c._id);
  const likes = await CommentLike.find({ user: currentUserId, comment: { $in: commentIds } });
  const likedIds = likes.map(l => l.comment.toString());

  return comments.map(c => ({
    ...c.toJSON(),
    userLiked: likedIds.includes(c._id.toString()),
  }));
};

// Видалити коментар
export const deleteComment = async (commentId: string, userId: string) => {
  const commentObjectId = new Types.ObjectId(commentId);
  const userObjectId = new Types.ObjectId(userId);

  const comment = await Comment.findById(commentObjectId);
  if (!comment || !comment.user.equals(userObjectId)) return false;

  await comment.deleteOne();
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
  return true;
};
