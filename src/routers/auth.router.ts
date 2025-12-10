import { Router } from "express";

import { registerController, loginController, getCurrentController } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authentikate.js";


const authRouter = Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);
authRouter.get("/current", authenticate, getCurrentController);

export default authRouter;