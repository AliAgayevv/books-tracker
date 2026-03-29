import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(32),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(1),
  totpToken: z.string().length(6).optional(),
});

export const deleteAccountSchema = z.object({
  currentPassword: z.string().min(1),
  totpToken: z.string().length(6).optional(),
});
