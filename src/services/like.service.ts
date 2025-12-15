import Like from "../db/models/Like.js";
import Post from "../db/models/Post.js";
import { Types } from "mongoose";
import notificationService from "./notification.service.js";

export const toggleLike = async (
  userId: Types.ObjectId | string,
  postId: string
) => {
  const userObjectId =
    typeof userId === "string" ? new Types.ObjectId(userId) : userId;
  const postObjectId = new Types.ObjectId(postId);

  const existing = await Like.findOne({
    user: userObjectId,
    post: postObjectId,
  });

  if (existing) {
    await existing.deleteOne();

    const post = await Post.findByIdAndUpdate(
      postObjectId,
      { $inc: { likesCount: -1 } },
      { new: true }
    );

    return {
      liked: false,
      likesCount: post?.likesCount ?? 0,
    };
  }

  await Like.create({ user: userObjectId, post: postObjectId });

  const post = await Post.findByIdAndUpdate(
    postObjectId,
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  if (post) {
    await notificationService.createNotification(
      post.author.toString(),
      userObjectId.toString(),
      "like",
      post._id.toString()
    );
  }

  return {
    liked: true,
    likesCount: post?.likesCount ?? 0,
  };
};

export const getLikes = async (postId: string) => {
  const postObjectId = new Types.ObjectId(postId);
  return Like.find({ post: postObjectId }).populate(
    "user",
    "username avatar"
  );
};
