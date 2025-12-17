import { Schema, model, Document, Types } from "mongoose";

export interface PostDocument extends Document {
  author: Types.ObjectId;
  content: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, default: "" },
    images: { type: [String], default: [] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id) ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

export default model<PostDocument>("Post", postSchema);
