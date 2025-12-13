import bcrypt from "bcrypt";
import { Types } from "mongoose";
import createTokens from "../utils/сreateTokens.js";
import { generateToken } from "../utils/jwt.js";
import User from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";
import { RegisterPayload, LoginPayload } from "../schemas/auth.schemas.js";
import { UserDocument } from "../db/models/User.js";

export type UserFindResult = UserDocument | null;

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    username: string;
    fullname: string;
    bio: string;
    avatar: string;
    website: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

// @ts-expect-error
export const findUser = (query) => User.findOne(query);

export const registerUser = async (
  payload: RegisterPayload
): Promise<UserDocument> => {
  const emailLC=payload.email.toLowerCase();
  const usernameLC=payload.username.toLowerCase();
  const user: UserFindResult = await User.findOne({ email: emailLC});
  const username: UserFindResult = await User.findOne({
    username: usernameLC,
  });
  if (user) throw HttpError(409, "Email already exist");
  if (username) throw HttpError(409, "Username already exist");

  const hashPassword: string = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, email: emailLC,
  username: usernameLC, password: hashPassword });
};

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResult> => {
  const identifierLC = payload.identifier.toLowerCase();
  const user: UserFindResult = await User.findOne({
    $or: [{ email: identifierLC}, { username: identifierLC }],
  }).select("+password");

  if (!user) throw HttpError(401, "User or Email not found");

  const passwordCompare: boolean = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!passwordCompare) throw HttpError(401, "Password invalid");

  const { accessToken, refreshToken } = createTokens(user._id);
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      bio: user.bio || "",
      avatar: user.avatar || "",
      website: user.website || "",
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
    },
  };
};

export const logoutUser = async (userId: Types.ObjectId): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    accessToken: null,
    refreshToken: null,
  });
};

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) throw HttpError(401, "Refresh token missing");

  const user = await User.findOne({ refreshToken });
  if (!user) throw HttpError(401, "Invalid refresh token");

  const newAccessToken = generateToken({ id: user._id }, { expiresIn: "15m" });
  user.accessToken = newAccessToken;
  await user.save();

  return { accessToken: newAccessToken };
};

