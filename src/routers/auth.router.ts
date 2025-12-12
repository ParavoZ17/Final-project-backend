import { Router } from "express";

import { registerController, loginController, getCurrentController,logoutController, refreshController } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authentikate.js";


const authRouter = Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);
authRouter.post("/logout", authenticate,logoutController)
authRouter.get("/current", authenticate, getCurrentController);
authRouter.post("/refresh", refreshController);

export default authRouter;