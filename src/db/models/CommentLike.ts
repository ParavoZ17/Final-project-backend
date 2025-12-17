import { Schema, model, Document, Types } from "mongoose";

export interface CommentLikeDocument extends Document {
  user: Types.ObjectId;
  comment: Types.ObjectId;
}

const commentLikeSchema = new Schema<CommentLikeDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
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

export default model<CommentLikeDocument>("CommentLike", commentLikeSchema);
