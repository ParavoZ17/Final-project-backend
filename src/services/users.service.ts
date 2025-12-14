import { Types } from "mongoose";

import User, { UserDocument } from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";
import { UpdateUserPayload, PublicUser } from "../types/user.interfaces.js";

export const getUserById = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId).select(
    "-password -accessToken -refreshToken"
  );

  if (!user) throw HttpError(404, "User not found");

  return mapUserDocumentToPublic(user);
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<PublicUser> => {
  const updateData: Partial<UpdateUserPayload> = {};

  if (payload.username) {
    const usernameLC = payload.username.toLowerCase();
    const exists = await User.findOne({ username: usernameLC, _id: { $ne: userId } });
    if (exists) throw HttpError(409, "Username already exists");
    updateData.username = usernameLC;
  }


  updateData.bio = payload.bio ?? "";
  updateData.avatar = payload.avatar ?? "";
  updateData.website = payload.website ?? "";

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
    "-password -accessToken -refreshToken"
  );

  if (!user) throw HttpError(404, "User not found");

  return mapUserDocumentToPublic(user);
};
export const getUserByUsername = async (username: string): Promise<PublicUser> => {
  const usernameLC = username.toLowerCase();

  const user = await User.findOne({ username: usernameLC }).select(
    "-password -accessToken -refreshToken -email"
  );

  if (!user) throw HttpError(404, "User not found");

  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    bio: user.bio || "",
    avatar: user.avatar || "",
    website: user.website || "",
    postsCount: user.postsCount || 0,
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
  };
};

const mapUserDocumentToPublic = (user: UserDocument): PublicUser => ({
  id: user._id.toString(),
  username: user.username,
  fullname: user.fullname,
  bio: user.bio ?? "",
  avatar: user.avatar ?? "",
  website: user.website ?? "",
  postsCount: user.postsCount ?? 0,
  followersCount: user.followersCount ?? 0,
  followingCount: user.followingCount ?? 0,
});


export const updateAvatar = async (
  userId: Types.ObjectId,
  avatarURL: string
): Promise<string | null> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarURL },
    { new: true }
  );

  return user?.avatar || null;
};