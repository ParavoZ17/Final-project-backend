import { Types } from "mongoose";

export interface MapPostOptions {
  userLiked?: boolean;
}

export const mapPost = (post: any, options?: MapPostOptions) => {
  return {
    id: post._id.toString(),
    content: post.content,
    images: post.images ?? [],
    likesCount: post.likesCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    createdAt: post.createdAt,

    author: post.author
      ? {
          id:
            post.author._id instanceof Types.ObjectId
              ? post.author._id.toString()
              : post.author._id,
          username: post.author.username,
          avatar: post.author.avatar,
          fullname: post.author.fullname,
        }
      : null,

    userLiked: options?.userLiked ?? false,
  };
};
