import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required").min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  userId: z.number("userId is required"),
  code: z.string("OTP is required").length(6, "OTP must be 6 digits"),
});
