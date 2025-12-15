import Post, { PostDocument } from "../db/models/Post.js";
import Like from "../db/models/Like.js";
import Comment from "../db/models/Comment.js";
import { Types } from "mongoose";

export const createPost = async (
  authorId: Types.ObjectId,
  content: string,
  images: string[]
): Promise<PostDocument> => {
  const post = await Post.create({ author: authorId, content, images });
  return post;
};

// Отримуємо пост стрічки з останніми 3 коментарями
export const getPosts = async (
  userId: Types.ObjectId,
  limit = 20,
  skip = 0
) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("author", "username avatar");

  const postIds = posts.map(p => p._id);

  const likes = await Like.find({
    user: userId,
    post: { $in: postIds },
  }).select("post");

  const likedSet = new Set(likes.map(l => l.post.toString()));

  // Беремо останні 3 коментарі для всіх постів
  const comments = await Comment.find({ post: { $in: postIds } })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("user", "username avatar");

  return posts.map(post => ({
    id: post._id.toString(),
    author: post.author,
    content: post.content,
    images: post.images,
    likesCount: post.likesCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    comments: comments
      .filter(c => c.post.toString() === post._id.toString())
      .map(c => ({
        id: c._id.toString(),
        author: c.user,
        content: c.content,
        createdAt: c.createdAt
      })),
    isLiked: likedSet.has(post._id.toString()),
    createdAt: post.createdAt,
  }));
};

// Отримуємо один пост з усіма коментарями
export const getPostById = async (
  postId: string,
  userId: Types.ObjectId
) => {
  const post = await Post.findById(postId).populate(
    "author",
    "username avatar"
  );

  if (!post) return null;

  const liked = await Like.exists({
    user: userId,
    post: post._id,
  });

  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: -1 })
    .populate("user", "username avatar");

  return {
    id: post._id.toString(),
    author: post.author,
    content: post.content,
    images: post.images,
    likesCount: post.likesCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    comments: comments.map(c => ({
      id: c._id.toString(),
      author: c.user,
      content: c.content,
      createdAt: c.createdAt
    })),
    isLiked: Boolean(liked),
    createdAt: post.createdAt,
  };
};

export const updatePost = async (
  postId: string,
  content?: string,
  newImages?: string[]
): Promise<PostDocument | null> => {
  const post = await Post.findById(postId);
  if (!post) return null;

  if (content) post.content = content;
  if (newImages && newImages.length > 0) {
    post.images = [...(post.images || []), ...newImages];
  }

  return post.save();
};

export const deletePost = async (postId: string): Promise<boolean> => {
  const result = await Post.findByIdAndDelete(postId);
  return !!result;
};
