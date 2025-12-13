import { Schema, model, Document } from "mongoose";
import {
  emailRegexp,
  fullNameRegexp,
  usernameRegexp,
  websiteRegexp,
} from "../../constants/auth.constant.js";

import { handleSaveError, setUpdateSettings } from "../hooks.js";

export interface UserDocument extends Document {
  username: string;
  fullname: string;
  email: string;
  password: string;

  bio?: string;
  avatar?: string;
  website?:string;

  postsCount: number;
  followersCount: number;
  followingCount: number;

  accessToken?: string;
  refreshToken?: string;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },

    username: {
      type: String,
      match: usernameRegexp,
      required: [true, "Username is required"],
      unique: true,
    },

    fullname: {
      type: String,
      match: fullNameRegexp,
      required: [true, "Full name is required"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // 🔐 password is not returned by default
    },

    // ===== PROFILE =====
    bio: {
      type: String,
      default: "",
      maxlength: [300, "Bio cannot exceed 300 characters"],
    },

    avatar: {
      type: String, // Base64
      default: "",
    },

    website: {
      type: String,
      default: "",
      match: [websiteRegexp, "Website must be a valid URL"],
    },

    // ===== COUNTERS (CACHE) =====
    postsCount: {
      type: Number,
      default: 0,
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    // ===== AUTH TOKENS =====
    accessToken: {
      type: String,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model<UserDocument>("user", userSchema);
export default User;