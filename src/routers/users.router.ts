import { Router } from "express";
import {
  getCurrentUserController,
  updateCurrentUserController,
  getUserByUsernameController,
  updateAvatar
} from "../controllers/users.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { uploadAvatar } from "../middlewares/upload.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getCurrentUserController);
userRouter.patch("/me", authenticate, updateCurrentUserController);
userRouter.patch(
  "/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatar
);
userRouter.get("/:username", getUserByUsernameController);


export default userRouter;
