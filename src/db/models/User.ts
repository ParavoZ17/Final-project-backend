import { Schema, model, Document } from "mongoose";
import {
  emailRegexp,
  fullNameRegexp,
  usernameRegexp,
} from "../../constants/auth.constant.js";

import { handleSaveError, setUpdateSettings } from "../hooks.js";

export interface UserDocument extends Document {
  username: string;
  fullname: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    match: emailRegexp,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    match: usernameRegexp,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    match: fullNameRegexp,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
 
  },
  refreshToken: {
    type: String,

  },
});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings );


userSchema.post("findOneAndUpdate", handleSaveError);

const User = model<UserDocument>("user", userSchema);
export default User;
