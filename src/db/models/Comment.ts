import { Schema, model, Document, Types } from "mongoose";

export interface CommentDocument extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id) ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

export default model<CommentDocument>("Comment", commentSchema);
