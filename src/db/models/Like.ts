import { Schema, model, Document, Types } from "mongoose";

export interface LikeDocument extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
}

const likeSchema = new Schema<LikeDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
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

export default model<LikeDocument>("Like", likeSchema);