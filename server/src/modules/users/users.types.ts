export { User as UserProfile } from "../auth/auth.types";

export interface UpdateUserProfileDto {
  username: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  totpToken?: string;
}

export interface DeleteProfileDto {
  currentPassword: string;
  totpToken?: string;
}
