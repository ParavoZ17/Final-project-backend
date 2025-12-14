import { Schema, model, Document, Types } from "mongoose";

export interface FollowDocument extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<FollowDocument>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

followSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);


followSchema.pre("save", function () {
  if (this.follower.equals(this.following)) {
    throw new Error("User cannot follow himself");
  }
});

const Follow = model<FollowDocument>("Follow", followSchema);
export default Follow;
