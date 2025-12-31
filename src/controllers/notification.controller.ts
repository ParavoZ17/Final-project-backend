  import { Request, Response } from "express";
  import notificationService from "../services/notification.service.js";
  import { AuthRequest } from "../types/interfaces.js";

  export const getNotificationsController = async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id.toString();
    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  };

  export const markNotificationReadController = async (req: AuthRequest, res: Response) => {
    const notificationId = req.params.id;
    if (!notificationId) return res.status(400).json({ message: "Notification ID required" });

    const updated = await notificationService.markAsRead(notificationId);
    res.json(updated);
  };
