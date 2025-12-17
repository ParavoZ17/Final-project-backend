import Post from "../db/models/Post.js";
import User from "../db/models/User.js";
import Like from "../db/models/Like.js";
import { Types } from "mongoose";
import { mapPost } from "../utils/mappers/post.mapper.js";
import Follow from "../db/models/Follow.js";

export const getPosts = async (
  userId: string,
  limit = 20,
  skip = 0
) => {
  const posts = await Post.find({
    author: { $ne: new Types.ObjectId(userId) },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("author", "username fullname avatar");

  const postIds = posts.map(p => p._id);
  const authorIds = posts.map(p => p.author._id.toString());

  // лайки
  const likes = await Like.find({
    user: userId,
    post: { $in: postIds },
  });

  const likedPostIds = new Set(
    likes.map(l => l.post?.toString())
  );

  // фолови
  const follows = await Follow.find({
    follower: userId,
    following: { $in: authorIds },
  });

  const followedAuthorIds = new Set(
    follows.map(f => f.following.toString())
  );

  return posts.map(post =>
    mapPost(post, {
      userLiked: likedPostIds.has(post._id.toString()),
      isAuthorFollowed: followedAuthorIds.has(
        post.author._id.toString()
      ),
    })
  );
};

export const createPost = async (userId: string, content: string, images: string[]) => {
  const post = await Post.create({
    author: userId,
    content,
    images,
  });

 
  await User.findByIdAndUpdate(userId, {
    $push: { posts: post._id },
    $inc: { postsCount: 1 },
  });

  return post.toJSON();
};

export const getPostById = async (
  postId: string,
  currentUserId: string
) => {
  const post = await Post.findById(postId).populate(
    "author",
    "username fullname avatar"
  );

  if (!post) return null;

  const [liked, followed] = await Promise.all([
    Like.exists({ user: currentUserId, post: post._id }),
    Follow.exists({
      follower: currentUserId,
      following: post.author._id,
    }),
  ]);

  return mapPost(post, {
    userLiked: !!liked,
    isAuthorFollowed: !!followed,
  });
};



export const updatePost = async (postId: string, content?: string, newImages?: string[]) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $set: { content }, $push: { images: { $each: newImages || [] } } },
    { new: true }
  );
  return post?.toJSON() || null;
};


export const deletePost = async (postId: string) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) return false;


  await User.findByIdAndUpdate(post.author, {
    $pull: { posts: post._id },
    $inc: { postsCount: -1 },
  });

  return true;
};
