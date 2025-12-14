import { Schema, model, Document, Types } from "mongoose";

export interface LikeDocument extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<LikeDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } 
);

likeSchema.index({ user: 1, post: 1 }, { unique: true }); 

export default model<LikeDocument>("Like", likeSchema);
