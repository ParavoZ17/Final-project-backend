import { Types } from "mongoose";
import { MongoServerError } from "mongodb";
import User from "../db/models/User.js";
import Follow, { FollowDocument } from "../db/models/Follow.js";
import HttpError from "../utils/HttpError.js";
import notificationService from "./notification.service.js";

class FollowService {
  async followUser(followerId: string, followingId: string): Promise<FollowDocument> {
    if (followerId === followingId) throw HttpError(400, "User cannot follow himself");

    try {
      const follow = await Follow.create({
        follower: new Types.ObjectId(followerId),
        following: new Types.ObjectId(followingId),
      });

      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

      // ✅ Створюємо нотифікацію для користувача, на якого підписалися
      await notificationService.createNotification(followingId, followerId, "follow");

      return follow;
    } catch (err) {
      const e = err as MongoServerError;
      if (e.code === 11000) throw HttpError(409, "Already following this user");
      throw err;
    }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<FollowDocument> {
    const deleted = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });
    if (!deleted) throw HttpError(404, "Not following this user");

    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

    return deleted;
  }

  async getFollowing(userId: string): Promise<FollowDocument[]> {
    return Follow.find({ follower: userId })
      .populate("following", "username fullname avatar")
      .lean();
  }

  async getFollowers(userId: string): Promise<FollowDocument[]> {
    return Follow.find({ following: userId })
      .populate("follower", "username fullname avatar")
      .lean();
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const exists = await Follow.exists({ follower: followerId, following: followingId });
    return !!exists;
  }

  async isFollowedBy(followingId: string, followerId: string): Promise<boolean> {
    const exists = await Follow.exists({ follower: followerId, following: followingId });
    return !!exists;
  }
}

export default new FollowService();
