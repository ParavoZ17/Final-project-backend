
import { PostWithAuthor } from "../../types/post.types.js";

export interface MapPostOptions {
  userLiked?: boolean;
  isAuthorFollowed?: boolean;
}

export const mapPost = (
  post: PostWithAuthor,
  options?: MapPostOptions
) => {
  return {
    id: post._id.toString(),
    content: post.content,
    images: post.images ?? [],
    likesCount: post.likesCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    createdAt: post.createdAt,

    author: post.author
      ? {
          id: post.author._id.toString(),
          username: post.author.username,
          fullname: post.author.fullname,
          avatar: post.author.avatar ?? "",
          isFollowedByCurrentUser: options?.isAuthorFollowed ?? false,
        }
      : null,

    userLiked: options?.userLiked ?? false,
  };
};
