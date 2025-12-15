import { Types } from "mongoose";
import Notification, { NotificationDocument, NotificationType } from "../db/models/Notification.js";

type PopulatedUser = {
  _id: Types.ObjectId;
  username: string;
  fullname: string;
  avatar: string;
};

type PopulatedPost = {
  _id: Types.ObjectId;
  content: string;
};

export type NotificationWithTimeAgo = {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  sender: PopulatedUser;
  type: NotificationType;
  post?: PopulatedPost;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  timeAgo: string;
};

class NotificationService {
  async createNotification(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    postId?: string
  ): Promise<NotificationDocument | null> {
    if (recipientId === senderId) return null;

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

    if (postId) data.post = new Types.ObjectId(postId);

    return Notification.create(data);
  }

  async getNotifications(
    recipientId: string,
    limit = 20,
    skip = 0
  ): Promise<NotificationWithTimeAgo[]> {
    const notifications = await Notification.find({ recipient: recipientId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("sender", "username fullname avatar")
      .populate("post", "content");

   return notifications.map(n => ({
  _id: n._id,
  recipient: n.recipient,
  sender: n.sender as unknown as PopulatedUser, 
  type: n.type,
  post: n.post ? (n.post as unknown as PopulatedPost) : undefined,
  read: n.read,
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
  timeAgo: this.formatTimeAgo(n.createdAt),
}));
  }

  async markAsRead(notificationId: string) {
    return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 1800) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 3600) return "30+ min ago";
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} d ago`;
    if (seconds < 31104000) return `${Math.floor(seconds / 2592000)} mo ago`;
    return `${Math.floor(seconds / 31104000)} y ago`;
  }
}

export default new NotificationService();
