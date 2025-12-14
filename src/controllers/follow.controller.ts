import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { AuthRequest } from "../types/interfaces.js";
import followService from "../services/follow.service.js";

export const followUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const followerId = req.user!._id.toString();
  const followingId = req.params.userId;
  if (!followingId) throw new Error("Missing userId param");

  const follow = await followService.followUser(followerId, followingId);

  res.status(201).json({
    message: "Successfully followed user",
    follow,
  });
});

export const unfollowUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const followerId = req.user!._id.toString();
  const followingId = req.params.userId;
  if (!followingId) throw new Error("Missing userId param");

  const deleted = await followService.unfollowUser(followerId, followingId);

  res.status(200).json({
    message: "Successfully unfollowed user",
    deleted,
  });
});

export const getFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId ?? req.user!._id.toString();

  const following = await followService.getFollowing(userId);

  res.status(200).json({ following });
});

export const getFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId ?? req.user!._id.toString();

  const followers = await followService.getFollowers(userId);

  res.status(200).json({ followers });
});

export const isFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const followerId = req.user!._id.toString();
  const followingId = req.params.userId;
  if (!followingId) throw new Error("Missing userId param");

  const result = await followService.isFollowing(followerId, followingId);

  res.status(200).json({ isFollowing: result });
});

export const isFollowedBy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const followingId = req.params.userId;
  const followerId = req.user!._id.toString();
  if (!followingId) throw new Error("Missing userId param");

  const result = await followService.isFollowedBy(followingId, followerId);

  res.status(200).json({ isFollowedBy: result });
});
