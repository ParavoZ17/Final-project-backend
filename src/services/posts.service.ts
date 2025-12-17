import Post from "../db/models/Post.js";
import User from "../db/models/User.js";
import Like from "../db/models/Like.js";
import { Types } from "mongoose";

// Отримати пости (для стрічки, окрім власних)
export const getPosts = async (userId: string, limit = 20, skip = 0) => {
  const posts = await Post.find({ author: { $ne: new Types.ObjectId(userId) } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("author", "username avatar fullname");

  const postIds = posts.map(p => p._id);
  const likes = await Like.find({ user: userId, post: { $in: postIds } });
  const likedIds = likes.map(l => l.post?.toString());

  return posts.map(p => ({
    ...p.toJSON(),
    userLiked: likedIds.includes(p._id.toString())
  }));
};

// Створення посту + оновлення користувача
export const createPost = async (userId: string, content: string, images: string[]) => {
  const post = await Post.create({
    author: userId,
    content,
    images,
  });

  // оновлюємо користувача
  await User.findByIdAndUpdate(userId, {
    $push: { posts: post._id },
    $inc: { postsCount: 1 },
  });

  return post.toJSON();
};

// Отримати пост за id
export const getPostById = async (postId: string, currentUserId: string) => {
  const post = await Post.findById(postId).populate("author", "username avatar fullname");
  if (!post) return null;

  const liked = await Like.exists({ user: currentUserId, post: post._id });

  return {
    ...post.toJSON(),
    userLiked: !!liked,
  };
};

// Оновлення посту
export const updatePost = async (postId: string, content?: string, newImages?: string[]) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $set: { content }, $push: { images: { $each: newImages || [] } } },
    { new: true }
  );
  return post?.toJSON() || null;
};

// Видалення посту + оновлення користувача
export const deletePost = async (postId: string) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) return false;

  // Оновлюємо користувача
  await User.findByIdAndUpdate(post.author, {
    $pull: { posts: post._id },
    $inc: { postsCount: -1 },
  });

  return true;
};
