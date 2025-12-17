  import { Types } from "mongoose";
import User from "../db/models/User.js";
import Post from "../db/models/Post.js";
import HttpError from "../utils/HttpError.js";
import { UpdateUserPayload, PublicUser } from "../types/user.interfaces.js";
import { mapPost } from "../utils/mappers/post.mapper.js";
import Follow from "../db/models/Follow.js";


export const getUserById = async (userId: string): Promise<PublicUser> => {
  return getUserWithPosts({ _id: userId });
};


export const getUserByUsername = async (
  username: string
): Promise<PublicUser> => {
  return getUserWithPosts({ username: username.toLowerCase() });
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<PublicUser> => {
  const updateData: Partial<UpdateUserPayload> = {};

  if (payload.username) {
    const usernameLC = payload.username.toLowerCase();

    const exists = await User.findOne({
      username: usernameLC,
      _id: { $ne: userId },
    });

    if (exists) {
      throw HttpError(409, "Username already exists");
    }

    updateData.username = usernameLC;
  }

  updateData.bio = payload.bio ?? "";
  updateData.avatar = payload.avatar ?? "";
  updateData.website = payload.website ?? "";

  await User.findByIdAndUpdate(userId, updateData, { new: true });

  return getUserWithPosts({ _id: userId });
};

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

 const getUserWithPosts = async (
  userQuery: object,
  currentUserId?: string
) => {
  const user = await User.findOne(userQuery).select(
    "-password -accessToken -refreshToken -email"
  );

  if (!user) throw HttpError(404, "User not found");

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate("author", "username fullname avatar");

  let isFollowed = false;

  if (currentUserId) {
    const follow = await Follow.exists({
      follower: currentUserId,
      following: user._id,
    });
    isFollowed = !!follow;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    bio: user.bio ?? "",
    avatar: user.avatar ?? "",
    website: user.website ?? "",
    postsCount: user.postsCount ?? posts.length,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,

    posts: posts.map(post =>
      mapPost(post, { isAuthorFollowed: isFollowed })
    ),
  };
};


