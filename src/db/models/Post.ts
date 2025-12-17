import { Schema, model, Document, Types } from "mongoose";

export interface PostDocument extends Document {
  author: Types.ObjectId;
  content: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    content: { type: String, required: true, maxlength: 5000 },
    images: { type: [String], default: [] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<PostDocument>("Post", postSchema);
