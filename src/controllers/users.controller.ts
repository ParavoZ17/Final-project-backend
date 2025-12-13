import { Request, Response } from "express";
import * as usersService from "../services/users.service.js";
import { updateUserSchema } from "../schemas/users.schemas.js";
import { UpdateUserPayload } from "../types/user.interfaces.js";
import { AuthRequest } from "../types/interfaces.js"; 

interface Params {
  username: string;
}

export const getCurrentUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString(); 
  const user = await usersService.getUserById(userId);
  res.json(user);
};


export const updateCurrentUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();

 
  const payload: Partial<UpdateUserPayload> = updateUserSchema.parse(req.body);

  if (!payload.username) {
    return res.status(400).json({ message: "Username is required" });
  }
  const updateData: UpdateUserPayload = {
  username: payload.username!, 
  bio: payload.bio ?? "",
  avatar: payload.avatar ?? "",
  website: payload.website ?? "",
};

  const updatedUser = await usersService.updateUser(userId, updateData);
  res.json(updatedUser);
};


export const getUserByUsernameController = async (req: Request<Params>, res: Response) => {
 
  const username = req.params.username.toLowerCase(); 
   if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const user = await usersService.getUserByUsername(username);
  res.json(user);
};
