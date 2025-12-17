import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addCommentController,
  getCommentsController,
  deleteCommentController,
  toggleCommentLikeController
} from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authenticate, asyncHandler(addCommentController));
router.get("/", authenticate, asyncHandler(getCommentsController));
router.delete("/:commentId", authenticate, asyncHandler(deleteCommentController));
router.post("/:commentId/like", authenticate, asyncHandler(toggleCommentLikeController));

export default router;
