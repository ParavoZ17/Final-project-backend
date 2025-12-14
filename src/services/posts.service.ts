import Post, { PostDocument } from "../db/models/Post.js";
import { Types } from "mongoose";

export const createPost = async (
  authorId: Types.ObjectId,
  content: string,
  images: string[]
): Promise<PostDocument> => {
  const post = await Post.create({ author: authorId, content, images });
  return post;
};

export const getPosts = async (limit = 20, skip = 0): Promise<PostDocument[]> => {
  return Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("author", "username fullname avatar");
};

export const getPostById = async (postId: string): Promise<PostDocument | null> => {
  return Post.findById(postId).populate("author", "username fullname avatar");
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
