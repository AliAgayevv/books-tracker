import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const verifyTotpSchema = z.object({
  token: z
    .string()
    .length(6, "TOTP token must be exactly 6 digits")
    .regex(/^\d+$/, "TOTP token must contain only digits"),
});
