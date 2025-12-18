import { Types } from "mongoose";
import Notification, {
  NotificationDocument,
  NotificationType,
} from "../db/models/Notification.js";
import {
  PopulatedUser,
  PopulatedPost,
  SenderField,
  PostField,
  isPopulatedUser,
  isPopulatedPost,
} from "../types/notification.types.js";
import { getIO } from "../utils/socket.js";

export type NotificationWithTimeAgo = {
  id: string;
  recipient: string;
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
    if (recipientId.toString() === senderId.toString()) return null;

    try {
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

      const notification = await Notification.create(data);

      // Socket.IO emit
      const io = getIO();
      io.to(recipientId).emit("new_notification", {
        id: notification._id.toString(),
        recipient: recipientId,
        sender: {
          _id: senderId,
        },
        type,
        post: postId ? { _id: postId } : undefined,
        read: false,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }

  async getNotifications(
    recipientId: string,
    limit = 20,
    skip = 0
  ): Promise<NotificationWithTimeAgo[]> {
    try {
      const notifications = await Notification.find({
        recipient: recipientId,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate("sender", "username fullname avatar")
        .populate("post", "content images");

      return notifications.map((n) => {
        const senderField = n.sender as SenderField;
        const postField = n.post as PostField | undefined;

        const sender: PopulatedUser = isPopulatedUser(senderField)
          ? senderField
          : {
              _id: senderField,
              username: "deleted",
              fullname: "",
              avatar: "",
            };

        const post: PopulatedPost | undefined =
          postField && isPopulatedPost(postField)
            ? postField
            : undefined;

        return {
          id: n._id.toString(),
          recipient: n.recipient.toString(),
          sender,
          type: n.type,
          post,
          read: n.read,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          timeAgo: this.formatTimeAgo(n.createdAt),
        };
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async markAsRead(
    notificationId: string
  ): Promise<NotificationDocument | null> {
    if (!notificationId) {
      throw new Error("Notification ID required");
    }

    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return null;
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} d ago`;
    if (seconds < 31104000)
      return `${Math.floor(seconds / 2592000)} mo ago`;
    return `${Math.floor(seconds / 31104000)} y ago`;
  }
}

export default new NotificationService();
