import { Router } from "express";
import { getNotificationsController, markNotificationReadController } from "../controllers/notification.controller.js";
import authenticate from "../middlewares/authenticate.js";

const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get("/", getNotificationsController);
notificationRouter.patch("/:id/read", markNotificationReadController);

export default notificationRouter;
