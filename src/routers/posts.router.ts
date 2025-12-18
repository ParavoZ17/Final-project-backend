import { Router, Request, Response } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadPostImages } from "../middlewares/upload.js";
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  getCurrentUserPostsController,
  updatePostController,
  deletePostController,
} from "../controllers/posts.controller.js";
import likeRouter from "./like.routes.js";
import commentsRouter from "./comment.routes.js";
import type { AuthRequest, PostParams } from "../types/interfaces.js";

const postsRouter = Router();

postsRouter.get("/", authenticate, asyncHandler(getPostsController));

postsRouter.post(
  "/",
  authenticate,
  uploadPostImages.array("images", 20),
  asyncHandler(createPostController)
);

postsRouter.get(
  "/currentUser",
  authenticate,
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      getCurrentUserPostsController(req, res)
  )
);

postsRouter.get(
  "/:id",
  authenticate,
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      getPostByIdController(req, res)
  )
);

postsRouter.patch(
  "/:id",
  authenticate,
  uploadPostImages.array("images", 20),
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      updatePostController(req, res)
  )
);

postsRouter.delete(
  "/:id",
  authenticate,
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      deletePostController(req, res)
  )
);

postsRouter.use("/:id/like", likeRouter);
postsRouter.use("/:id/comment", commentsRouter);

export default postsRouter;