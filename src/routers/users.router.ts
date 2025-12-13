import { Router } from "express";
import {
  getCurrentUserController,
  updateCurrentUserController,
  getUserByUsernameController,
} from "../controllers/users.controller.js";
import authenticate from "../middlewares/authenticate.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getCurrentUserController);
userRouter.patch("/me", authenticate, updateCurrentUserController);
userRouter.get("/:username", getUserByUsernameController);

export default userRouter;
