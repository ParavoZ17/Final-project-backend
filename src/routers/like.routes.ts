import { Router, Response } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { toggleLikeController, getLikesController } from "../controllers/like.controller.js";
import type { AuthRequest } from "../types/interfaces.js";

const likeRouter = Router({ mergeParams: true });

// POST /posts/:id/like
likeRouter.post(
  "/",
  authenticate,
  asyncHandler((req, res: Response) => toggleLikeController(req as AuthRequest, res))
);

// GET /posts/:id/like
likeRouter.get(
  "/",
  authenticate,
  asyncHandler((req, res: Response) => getLikesController(req as AuthRequest, res))
);

export default likeRouter;
