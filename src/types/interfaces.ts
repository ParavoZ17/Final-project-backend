import {Request } from "express";
import { UserDocument } from "../db/models/User.js";

export interface ResponseError extends Error {
  status: number;
}

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export type CommentRequest<TParams = {}> = AuthRequest & Request<TParams>;

export interface Params {
  id: string; 
}

export interface PostParams {
  id: string;
}

export interface CommentParams {
  commentId: string;
}

export interface UserIdParams {
  userId: string;
}