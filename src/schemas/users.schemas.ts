import { z } from "zod";
import { usernameRegexp, websiteRegexp } from "../constants/auth.constant.js";

export const updateUserSchema = z.object({
  username: z.string().regex(usernameRegexp, "Username has invalid format"),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
  avatar: z.string().optional(),
  website: z.string().regex(websiteRegexp, "Website must be a valid URL").optional(),
});
