import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../db/models/User.js";

import HttpError from "../utils/HttpError.js";

import { RegisterPayload, LoginPayload } from "../schemas/auth.schemas.js";

import { UserDocument } from "../db/models/User.js";

const {JWT_SECRET} = process.env;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET not define in environment variables");
}

type UserFindResult = UserDocument | null;

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        username: string;
        fullname: string;
    }
}

export const registerUser = async (payload: RegisterPayload): Promise<UserDocument> => {
    const user: UserFindResult = await User.findOne({email: payload.email});
    const username: UserFindResult = await User.findOne({username: payload.username});
    if(user) throw HttpError(409, "Email already exist");
    if(username) throw HttpError(409, "Username already exist");

    const hashPassword: string = await bcrypt.hash(payload.password, 10);
    return User.create({...payload, password: hashPassword});
}

export const loginUser = async(payload: LoginPayload): Promise<LoginResult> => {
    const user: UserFindResult = await User.findOne({
  $or: [
    { email: payload.identifier },
    { username: payload.identifier }
  ]
});


    if(!user) throw HttpError(401, "User or Email not found");

    const passwordCompare: boolean = await bcrypt.compare(payload.password, user.password);
    if(!passwordCompare) throw HttpError(401, "Password invalid");
    const tokenPayload = {
        id: user._id,
    };

    const accessToken: string = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: "20m"});
    const refreshToken: string = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: "14d"});
    await User.findByIdAndUpdate(user._id, {accessToken, refreshToken});

    return {
        accessToken,
        refreshToken,
        user: {
            email: user.email,
            username: user.username,
            fullname: user.fullname,

        }
    }
}