import { Router } from "express";
import {
  getCurrentUserController,
  updateCurrentUserController,
  getUserByUsernameController,
  updateAvatarController,
} from "../controllers/users.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { uploadAvatar } from "../middlewares/upload.js";
import followRouter from "./follow.routes.js"; 

const userRouter = Router();


userRouter.get("/me", authenticate, getCurrentUserController);
userRouter.patch("/me", authenticate, updateCurrentUserController);
userRouter.patch(
  "/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatarController
);

userRouter.get("/:username", getUserByUsernameController);


userRouter.use("/:userId", followRouter);

export default userRouter;
