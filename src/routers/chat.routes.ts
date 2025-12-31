import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import * as chatController from "../controllers/chat.controller.js";

const router = Router();

router.get("/", authenticate, chatController.getChats);
router.post("/", authenticate, chatController.createOrGetChat);

export default router;
