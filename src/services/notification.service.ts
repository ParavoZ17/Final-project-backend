import { Types } from "mongoose";
import Notification, { NotificationDocument, NotificationType } from "../db/models/Notification.js";

class NotificationService {
  // Створити нотифікацію
  async createNotification(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    postId?: string
  ): Promise<NotificationDocument | null> {
    // Не створюємо нотифікацію, якщо sender == recipient
    if (recipientId === senderId) return null;

    // Формуємо об'єкт даних
    const data: {
      recipient: Types.ObjectId;
      sender: Types.ObjectId;
      type: NotificationType;
      post?: Types.ObjectId;
    } = {
      recipient: new Types.ObjectId(recipientId),
      sender: new Types.ObjectId(senderId),
      type,
    };

    if (postId) {
      data.post = new Types.ObjectId(postId);
    }

    // Створюємо нотифікацію
    return Notification.create(data);
  }

  // Отримати нотифікації для користувача
  async getNotifications(
    recipientId: string,
    limit = 20,
    skip = 0
  ): Promise<NotificationDocument[]> {
    return Notification.find({ recipient: recipientId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("sender", "username fullname avatar")
      .populate("post", "content");
  }

  // Позначити нотифікацію як прочитану
  async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
    return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }
}

export default new NotificationService();
