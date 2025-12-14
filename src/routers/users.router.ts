import { Router } from "express";
import {
  getCurrentUserController,
  updateCurrentUserController,
  getUserByUsernameController,
  updateAvatarController,
} from "../controllers/users.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { uploadAvatar } from "../middlewares/upload.js";
import followRouter from "./follow.routes.js"; // <-- імпорт followRouter

const userRouter = Router();

// Поточний користувач
userRouter.get("/me", authenticate, getCurrentUserController);
userRouter.patch("/me", authenticate, updateCurrentUserController);
userRouter.patch(
  "/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatarController
);

// Інший користувач по username
userRouter.get("/:username", getUserByUsernameController);

// Підключаємо followRouter як підмаршрут для конкретного користувача
// Всі маршрути типу /users/:userId/follow, /users/:userId/followers тощо
userRouter.use("/:userId", followRouter);

export default userRouter;
