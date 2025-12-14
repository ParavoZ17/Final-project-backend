import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addCommentController,
  getCommentsController,
  deleteCommentController,
} from "../controllers/comment.controller.js";

const commentsRouter = Router({ mergeParams: true });

// POST /comments
commentsRouter.post("/", authenticate, asyncHandler(addCommentController));

// GET /comments
commentsRouter.get("/", authenticate, asyncHandler(getCommentsController));

// DELETE /comments/:commentId
commentsRouter.delete("/:commentId", authenticate, asyncHandler(deleteCommentController));

export default commentsRouter;
