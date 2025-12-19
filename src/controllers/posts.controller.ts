import { Request, Response } from "express";
import * as postService from "../services/posts.service.js";
import { AuthRequest, Params } from "../types/interfaces.js";
import Post from "../db/models/Post.js";

export const createPostController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { content } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    const images = files?.map(f => f.path) || [];

    if (!content && images.length === 0) {
      return res.status(400).json({ message: "Post content or images required" });
    }

    const post = await postService.createPost(userId, content, images);
    res.status(201).json(post);
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const getPostsController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const posts = await postService.getPosts(userId, 20, 0);
    res.json(posts);
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const getPostByIdController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  try {
    const userId = req.user!._id.toString();
    const post = await postService.getPostById(req.params.id, userId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const getCurrentUserPostsController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  try {
    const userId = req.user!._id.toString();
    const post = await postService.getPosts(userId, 20, 0);
    res.json(post);
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const updatePostController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  try {

    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.author.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { content } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    const newImages = files?.map(f => f.path) || [];

    const post = await postService.updatePost(
      req.params.id,
      content,
      newImages
    );

    res.json(post);
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const deletePostController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  try {
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

  
    if (existingPost.author.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }


    await postService.deletePost(req.params.id);

    res.json({ _id: existingPost._id });
  } catch (err: unknown) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};
