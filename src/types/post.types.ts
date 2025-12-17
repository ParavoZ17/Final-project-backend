import { Types } from "mongoose";

export interface PostAuthor {
  _id: Types.ObjectId;
  username: string;
  fullname: string;
  avatar?: string;
}

export interface PostWithAuthor {
  _id: Types.ObjectId;
  content: string;
  images?: string[];
  likesCount?: number;
  commentsCount?: number;
  createdAt: Date;
  author: PostAuthor; 
}

export interface PostForFrontend {
  id: string;
  content: string;
  images?: string[];
  likesCount?: number;
  commentsCount?: number;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
    isFollowedByCurrentUser: boolean;
  } | null;
  userLiked?: boolean;
}
