import { Router, Request, Response } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { toggleLikeController, getLikesController } from "../controllers/like.controller.js";
import type { AuthRequest, PostParams } from "../types/interfaces.js";

const likeRouter = Router({ mergeParams: true });

// POST /posts/:id/like
likeRouter.post(
  "/",
  authenticate,
  asyncHandler((req: AuthRequest & Request<PostParams>, res: Response) =>
    toggleLikeController(req, res)
  )
);

// GET /posts/:id/like
likeRouter.get(
  "/",
  authenticate,
  asyncHandler((req: Request<PostParams>, res: Response) =>
    getLikesController(req, res)
  )
);

export default likeRouter;
