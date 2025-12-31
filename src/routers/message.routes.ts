import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/:chatId", authenticate, messageController.getMessages);
router.post("/", authenticate, messageController.sendMessage);



export default router;
