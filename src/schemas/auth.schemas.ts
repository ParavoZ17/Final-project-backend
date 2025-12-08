import * as z from "zod";
import {passwordRegexp, emailRegexp, usernameRegexp, fullNameRegexp} from "../constants/auth.constant.js"


export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email cannot be empty" })
    .regex(
      emailRegexp,
      { message: "Invalid email address" }
    ),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      passwordRegexp,
      { message: "Password must contain only English letters and at least one number" }
    ),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(usernameRegexp, { message: "Username can contain only english letters, numbers, and underscores" }),

  fullname: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .regex(fullNameRegexp, { message: "Full name can contain only letters and spaces" }),
});

export type RegisterPayload = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Please enter your username or email" })
    .refine(
      (val) => emailRegexp.test(val) || usernameRegexp.test(val),
      { message: "Must be a valid email or username" }
    ),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type LoginPayload = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().toLowerCase().trim().email({ message: "Invalid email" })

});

export type forgotPassword = z.infer<typeof forgotPasswordSchema>