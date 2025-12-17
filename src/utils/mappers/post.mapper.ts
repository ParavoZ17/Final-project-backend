// import { PostWithAuthor, PostForFrontend } from "../../types/post.types.js";

// export const mapPost = (
//   post: PostWithAuthor,
//   options: { isAuthorFollowed: boolean }
// ) => {
//   return {
//     id: post._id.toString(),  
//     content: post.content,
//     images: post.images || [],
//     likesCount: post.likesCount || 0,
//     commentsCount: post.commentsCount || 0,
//     createdAt: post.createdAt,
//     author: post.author
//       ? {
//           id: post.author._id.toString(),  
//           username: post.author.username,
//           fullname: post.author.fullname,
//           avatar: post.author.avatar,
//           isFollowedByCurrentUser: options.isAuthorFollowed,
//         }
//       : null,
//     userLiked: false,
//   };
// };

// export const mapPostForFrontend = (
//   post: PostWithAuthor,
//   isAuthorFollowed: boolean
// ): PostForFrontend => ({
//   id: post._id.toString(),
//   content: post.content,
//   images: post.images || [],
//   likesCount: post.likesCount || 0,
//   commentsCount: post.commentsCount || 0,
//   createdAt: post.createdAt,
//   author: post.author
//     ? {
//         id: post.author._id.toString(),
//         username: post.author.username,
//         fullname: post.author.fullname,
//         avatar: post.author.avatar,
//         isFollowedByCurrentUser: isAuthorFollowed,
//       }
//     : null,
//   userLiked: false,
// });
import { PostWithAuthor, PostForFrontend } from "../../types/post.types.js";

export const mapPostForFrontend = (
  post: PostWithAuthor,
  options: { userLiked?: boolean; isAuthorFollowed: boolean }
): PostForFrontend => ({
  id: post._id.toString(),
  content: post.content,
  images: post.images || [],
  likesCount: post.likesCount || 0,
  commentsCount: post.commentsCount || 0,
  createdAt: post.createdAt,
  author: post.author
    ? {
        id: post.author._id.toString(),
        username: post.author.username,
        fullname: post.author.fullname,
        avatar: post.author.avatar,
        isFollowedByCurrentUser: options.isAuthorFollowed,
      }
    : null,
  userLiked: options.userLiked || false,
});
