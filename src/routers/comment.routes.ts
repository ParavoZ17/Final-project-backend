import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addCommentController,
  getCommentsController,
  deleteCommentController,
} from "../controllers/comment.controller.js";

const commentsRouter = Router({ mergeParams: true });


commentsRouter.post("/", authenticate, asyncHandler(addCommentController));

commentsRouter.get("/", authenticate, asyncHandler(getCommentsController));

commentsRouter.delete("/:commentId", authenticate, asyncHandler(deleteCommentController));

export default commentsRouter;
