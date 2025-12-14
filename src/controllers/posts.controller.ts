import { Request, Response } from "express";
import * as postService from "../services/posts.service.js";
import { AuthRequest, Params } from "../types/interfaces.js";


export const createPostController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { content } = req.body;
  const images = (req.files as Express.Multer.File[]).map(f => f.path);

  if (!content && images.length === 0) {
    return res.status(400).json({ message: "Post content or images required" });
  }

  const post = await postService.createPost(userId, content, images);
  res.status(201).json(post);
};

export const getPostsController = async (req: Request, res: Response) => {
  const posts = await postService.getPosts(20, 0);
  res.json(posts);
};

export const getPostByIdController = async (
  req: Request<Params>,
  res: Response
) => {
  const post = await postService.getPostById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const updatePostController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  const { content } = req.body;
  const newImages = (req.files as Express.Multer.File[])?.map(f => f.path) || [];

  const post = await postService.updatePost(req.params.id, content, newImages);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const deletePostController = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  const deleted = await postService.deletePost(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post deleted" });
};