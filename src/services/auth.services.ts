// import bcrypt from "bcrypt";
// import { Types } from "mongoose";
// import {generateToken} from "../utils/jwt.js"

// import User from "../db/models/User.js";

// import HttpError from "../utils/HttpError.js";

// import { RegisterPayload, LoginPayload } from "../schemas/auth.schemas.js";

// import { UserDocument } from "../db/models/User.js";



// export type UserFindResult = UserDocument | null;

// export interface LoginResult {
//     accessToken: string;
//     refreshToken: string;
//     user: {
//         email: string;
//         username: string;
//         fullname: string;
//     }
// }

// export const createTokens = (id:Types.ObjectId) => {
//     const accessToken: string = generateToken({id}, {expiresIn: "2m"});
//     const refreshToken: string = generateToken({id}, {expiresIn: "14d"});
//     return {
//         accessToken,
//         refreshToken
//     }
// }

// // @ts-expect-error
// export const findUser = query => User.findOne(query);

// export const registerUser = async (payload: RegisterPayload): Promise<UserDocument> => {
//     const user: UserFindResult = await User.findOne({email: payload.email});
//     const username: UserFindResult = await User.findOne({username: payload.username});
//     if(user) throw HttpError(409, "Email already exist");
//     if(username) throw HttpError(409, "Username already exist");

//     const hashPassword: string = await bcrypt.hash(payload.password, 10);
//     return User.create({...payload, password: hashPassword});
// }

// export const loginUser = async(payload: LoginPayload): Promise<LoginResult> => {
//     const user: UserFindResult = await User.findOne({
//   $or: [
//     { email: payload.identifier },
//     { username: payload.identifier }
//   ]
// });

//     if(!user) throw HttpError(401, "User or Email not found");

//     const passwordCompare: boolean = await bcrypt.compare(payload.password, user.password);
//     if(!passwordCompare) throw HttpError(401, "Password invalid");
   
//     const {accessToken, refreshToken} = createTokens(user._id)
//     await User.findByIdAndUpdate(user._id, {accessToken, refreshToken});

//     return {
//         accessToken,
//         refreshToken,
//         user: {
//             email: user.email,
//             username: user.username,
//             fullname: user.fullname,

//         }
//     }
// }

// export const logoutUser = async (userId: Types.ObjectId): Promise<void> => {
//   await User.findByIdAndUpdate(userId, {
//     accessToken: null,
//     refreshToken: null,
//   });
// };

// export const refreshTokens = async (refreshToken: string) => {
//   console.log("refreshTokens received:", refreshToken)
//   if (!refreshToken) throw HttpError(401, "Refresh token missing");

//   const user = await User.findOne({ refreshToken });
//   if (!user) throw HttpError(401, "Invalid refresh token");

//   const newAccessToken = generateToken({ id: user._id }, { expiresIn: "2m" });

//   user.accessToken = newAccessToken;
//   await user.save();

//   return { accessToken: newAccessToken };
// };
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { generateToken } from "../utils/jwt.js";
import User from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";
import { RegisterPayload, LoginPayload } from "../schemas/auth.schemas.js";
import { UserDocument } from "../db/models/User.js";

export type UserFindResult = UserDocument | null;

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    username: string;
    fullname: string;
  };
}

export const createTokens = (id: Types.ObjectId) => {
  const accessToken: string = generateToken({ id }, { expiresIn: "2m" });
  const refreshToken: string = generateToken({ id }, { expiresIn: "14d" });
  return { accessToken, refreshToken };
};

// @ts-expect-error
export const findUser = query => User.findOne(query);

export const registerUser = async (payload: RegisterPayload): Promise<UserDocument> => {
  const user: UserFindResult = await User.findOne({ email: payload.email });
  const username: UserFindResult = await User.findOne({ username: payload.username });
  if (user) throw HttpError(409, "Email already exist");
  if (username) throw HttpError(409, "Username already exist");

  const hashPassword: string = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResult> => {
  const user: UserFindResult = await User.findOne({
    $or: [{ email: payload.identifier }, { username: payload.identifier }]
  });

  if (!user) throw HttpError(401, "User or Email not found");

  const passwordCompare: boolean = await bcrypt.compare(payload.password, user.password);
  if (!passwordCompare) throw HttpError(401, "Password invalid");

  const { accessToken, refreshToken } = createTokens(user._id);
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
      fullname: user.fullname
    }
  };
};

export const logoutUser = async (userId: Types.ObjectId): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    accessToken: null,
    refreshToken: null
  });
};

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) throw HttpError(401, "Refresh token missing");

  const user = await User.findOne({ refreshToken });
  if (!user) throw HttpError(401, "Invalid refresh token");

  const newAccessToken = generateToken({ id: user._id }, { expiresIn: "2m" });
  user.accessToken = newAccessToken;
  await user.save();

  return { accessToken: newAccessToken };
};
