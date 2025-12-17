import { Types } from "mongoose";

export interface SocketNotification {
  type: "follow" | "like" | "comment";
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  post?: {
    _id: string;
    content: string;
  };
  timeAgo: string;
}

export interface UserSocketMap {
  [userId: string]: string; 
}
