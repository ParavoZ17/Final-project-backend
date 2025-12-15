import { Schema, model, Document, Types } from "mongoose";

export type NotificationType = "follow" | "like" | "comment";

export interface NotificationDocument extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: NotificationType;
  post?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date; 
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<NotificationDocument>("Notification", notificationSchema);
