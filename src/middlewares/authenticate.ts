import { RequestHandler } from "express";
import { authenticateByToken } from "../utils/authenticateByToken.js";

const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.get("Authorization");

  const user = await authenticateByToken(authorization);

  req.user = user; 
  next();
};

export default authenticate;
