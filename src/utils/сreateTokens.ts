import { generateToken } from "./jwt.js";
import { Types } from "mongoose";




const createTokens = (id: Types.ObjectId) => {
  const accessToken: string = generateToken({ id }, { expiresIn: "15m" });
  const refreshToken: string = generateToken({ id }, { expiresIn: "14d" });
  return { accessToken, refreshToken };
};

export default createTokens;