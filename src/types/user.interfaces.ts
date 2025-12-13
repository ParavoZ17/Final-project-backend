import { Types } from "mongoose";

export interface PublicUser {
  username: string;
  fullname: string;
  bio: string;
  avatar: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
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
