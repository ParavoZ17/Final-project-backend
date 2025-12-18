import { Types } from "mongoose";

export type PopulatedUser = {
  _id: Types.ObjectId;
  username: string;
  fullname: string;
  avatar: string;
};

export type PopulatedPost = {
  _id: Types.ObjectId;
  content: string;
  images?: string[];
};

export type SenderField = Types.ObjectId | PopulatedUser;
export type PostField = Types.ObjectId | PopulatedPost;

/**
 * sender: ObjectId | PopulatedUser
 */
export function isPopulatedUser(sender: SenderField): sender is PopulatedUser {
  return (
    typeof sender === "object" &&
    sender !== null &&
    "username" in sender &&
    "fullname" in sender &&
    "avatar" in sender
  );
}

/**
 * post: ObjectId | PopulatedPost
 */
export function isPopulatedPost(post: PostField): post is PopulatedPost {
  return (
    typeof post === "object" &&
    post !== null &&
    "content" in post
  );
}
