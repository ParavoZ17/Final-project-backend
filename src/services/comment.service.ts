import Comment from "../db/models/Comment.js";
import Post from "../db/models/Post.js";
import { Types } from "mongoose";
import notificationService from "./notification.service.js";

export const addComment = async (
  userId: Types.ObjectId | string,
  postId: string,
  content: string
) => {
  const postObjectId = new Types.ObjectId(postId);
  const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const comment = await Comment.create({
    user: userObjectId,
    post: postObjectId,
    content,
  });

  await Post.findByIdAndUpdate(postObjectId, { $inc: { commentsCount: 1 } });

  // ✅ Створюємо нотифікацію автору поста
  const post = await Post.findById(postObjectId);
  if (post) {
    await notificationService.createNotification(
      post.author.toString(),
      userObjectId.toString(),
      "comment",
      post._id.toString()
    );
  }

  return comment;
};

export const getComments = async (postId: string) => {
  const postObjectId = new Types.ObjectId(postId);
  return Comment.find({ post: postObjectId })
    .sort({ createdAt: -1 })
    .populate("user", "username avatar");
};

export const deleteComment = async (
  commentId: string,
  userId: Types.ObjectId | string
) => {
  const commentObjectId = new Types.ObjectId(commentId);
  const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const comment = await Comment.findById(commentObjectId);
  if (!comment) return false;
  if (!comment.user.equals(userObjectId)) return false;

  await comment.deleteOne();
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
  return true;
};
