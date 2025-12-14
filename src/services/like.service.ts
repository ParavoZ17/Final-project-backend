import Like from "../db/models/Like.js";
import Post from "../db/models/Post.js";
import { Types } from "mongoose";

export const toggleLike = async (
  userId: Types.ObjectId | string,
  postId: string
) => {
  const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
  const postObjectId = new Types.ObjectId(postId);

  const existing = await Like.findOne({ user: userObjectId, post: postObjectId });

  if (existing) {
    await existing.deleteOne();
    await Post.findByIdAndUpdate(postObjectId, { $inc: { likesCount: -1 } });
    return { liked: false };
  } else {
    await Like.create({ user: userObjectId, post: postObjectId });
    await Post.findByIdAndUpdate(postObjectId, { $inc: { likesCount: 1 } });
    return { liked: true };
  }
};

export const getLikes = async (postId: string) => {
  const postObjectId = new Types.ObjectId(postId);
  return Like.find({ post: postObjectId }).populate("user", "username avatar");
};
