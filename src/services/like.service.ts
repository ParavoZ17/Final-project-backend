import { Types } from "mongoose";
import Like from "../db/models/Like.js";
import Post from "../db/models/Post.js";
import notificationService from "./notification.service.js";

export const toggleLike = async (userId: string, postId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const postObjectId = new Types.ObjectId(postId);

  const existing = await Like.findOne({ user: userObjectId, post: postObjectId });

  if (existing) {
    await existing.deleteOne();
    const post = await Post.findByIdAndUpdate(postObjectId, { $inc: { likesCount: -1 } }, { new: true });
    return { liked: false, likesCount: post?.likesCount ?? 0 };
  }

  await Like.create({ user: userObjectId, post: postObjectId });
  const post = await Post.findByIdAndUpdate(postObjectId, { $inc: { likesCount: 1 } }, { new: true });

  if (post) {
    await notificationService.createNotification(post.author.toString(), userId, "like", post._id.toString());
  }

  return { liked: true, likesCount: post?.likesCount ?? 0 };
};

export const getLikes = async (postId: string, currentUserId?: string) => {
  const postObjectId = new Types.ObjectId(postId);
  const likes = await Like.find({ post: postObjectId }).populate("user", "username avatar");

  if (!currentUserId) return likes.map(l => ({ ...l.toJSON(), userLiked: false }));

  const userLiked = likes.some(l => l.user._id.toString() === currentUserId);
  return likes.map(l => ({ ...l.toJSON(), userLiked }));
};
