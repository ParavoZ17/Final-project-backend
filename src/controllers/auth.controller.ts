import { AuthRequest } from "../types/interfaces.js";
import { Request, Response, RequestHandler } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../services/auth.services.js";
import createTokens from "../utils/сreateTokens.js";

import validateBody from "../utils/validateBody.js";

import { registerSchema, loginSchema } from "./../schemas/auth.schemas.js";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  //@ts-expect-error
  validateBody(registerSchema, req.body);
  await registerUser(req.body);

  res.status(201).json({
    message: "User register successfully",
  });
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    //@ts-expect-error
    validateBody(loginSchema, req.body);
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getCurrentController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }
  const { accessToken, refreshToken } = createTokens(req.user._id);
  res.json({
    accessToken,
    refreshToken,
    user: {
      username: req.user.username,
      fullname: req.user.fullname,
      email: req.user.email,
      bio: req.user.bio,
      avatar: req.user.avatar || "",
      website: req.user.website || "",
      postsCount: req.user.postsCount || 0,
      followersCount: req.user.followersCount || 0,
      followingCount: req.user.followingCount || 0,
    },
  });
};

export const logoutController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  await logoutUser(req.user._id);

  res.status(204).end();
};

  export const refreshController = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      const tokens = await refreshTokens(refreshToken);

      res.json(tokens);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  };
