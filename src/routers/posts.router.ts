import { Router, Request, Response } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadPostImages } from "../middlewares/upload.js";
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} from "../controllers/posts.controller.js";
import likeRouter from "./like.routes.js";
import commentsRouter from "./comment.routes.js";
import type { AuthRequest, PostParams } from "../types/interfaces.js";

const postsRouter = Router();

// GET /posts
postsRouter.get("/", authenticate, asyncHandler(getPostsController));

// POST /posts
postsRouter.post(
  "/",
  authenticate,
  uploadPostImages.array("images", 20),
  asyncHandler(createPostController)
);

// GET /posts/:id
postsRouter.get(
  "/:id",
  authenticate,
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      getPostByIdController(req, res)
  )
);

// PATCH /posts/:id
postsRouter.patch(
  "/:id",
  authenticate,
  uploadPostImages.array("images", 20),
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      updatePostController(req, res)
  )
);

// DELETE /posts/:id
postsRouter.delete(
  "/:id",
  authenticate,
  asyncHandler(
    (req: AuthRequest & Request<PostParams>, res: Response) =>
      deletePostController(req, res)
  )
);

// підмаршрути лайків і коментарів
postsRouter.use("/:id/like", likeRouter);
postsRouter.use("/:id/comment", commentsRouter);

export default postsRouter;
