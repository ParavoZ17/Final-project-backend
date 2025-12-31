import HttpError from "./HttpError.js";
import { findUser } from "../services/auth.services.js";
import { verifyToken } from "./jwt.js";
import { UserDocument } from "../db/models/User.js";

export const authenticateByToken = async (
  authorization?: string
): Promise<UserDocument> => {
  if (!authorization) {
    throw HttpError(401, "Authorization header missing");
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw HttpError(401, "authorization header must have type Bearer");
  }

  if (!token) {
    throw HttpError(401, "authorization header must have token");
  }

  const { data: payload, error } = verifyToken(token);

  if (error?.message === "jwt expired") {
    throw HttpError(401, "accessToken expired");
  }

  if (error) {
    throw HttpError(401, error.message);
  }

  if (!payload) {
    throw HttpError(401, "JWT payload not found");
  }

  const user = await findUser({ _id: payload.id });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  return user; // ✅ ТЕПЕР ЦЕ UserDocument
};
