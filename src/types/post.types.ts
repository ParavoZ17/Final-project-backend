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
  author?: PostAuthor;
}
