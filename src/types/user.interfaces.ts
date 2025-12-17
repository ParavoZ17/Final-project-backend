import { Types } from "mongoose";

import { PostForFrontend } from "./post.types.js";

export interface PublicUser {
  id: string;
  username: string;
  fullname: string;
  bio: string;
  avatar: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  posts?: PostForFrontend[];
}
export interface UpdateUserPayload {
  username: string;
  bio?: string | undefined;
  avatar?: string | undefined;
  website?: string | undefined;
}


export interface UserId {
  _id: Types.ObjectId;
}
