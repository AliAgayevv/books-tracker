import bcrypt from "bcrypt";
import { ErrorCode, HttpStatus } from "@books-tracker/shared";
import { usersRepository } from "./users.repository";
import { AppError } from "../../middleware/errorHandler";
import { totpService } from "../auth/totp.service";
import type { UserRow } from "../auth/auth.types";
import type {
  UserProfile,
  UpdateUserProfileDto,
  ChangePasswordDto,
  DeleteProfileDto,
} from "./users.types";

const SALT_ROUNDS = 12;

function toUser(row: UserRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    twoFactorEnabled: row.two_factor_enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const usersService = {
  async getProfileInformation(userId: number): Promise<UserProfile> {
    const row = await usersRepository.findById(userId);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    return toUser(row);
  },

  async updateProfileInformation(userId: number, dto: UpdateUserProfileDto): Promise<UserProfile> {
    const existing = await usersRepository.findByUsername(dto.username);
    if (existing && existing.id !== userId) {
      throw new AppError("Username already taken", HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS);
    }

    const row = await usersRepository.updateById(userId, dto);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    return toUser(row);
  },

  async deleteAccount(userId: number, dto: DeleteProfileDto): Promise<void> {
    const row = await usersRepository.findById(userId);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if (row.two_factor_enabled) {
      if (!dto.totpToken) {
        throw new AppError(
          "2FA code required to delete account",
          HttpStatus.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED,
        );
      }
      const isTotpValid = totpService.verifyToken(row.two_factor_secret!, dto.totpToken);
      if (!isTotpValid) {
        throw new AppError(
          "Invalid or expired 2FA code",
          HttpStatus.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED,
        );
      }
    }
    await usersRepository.deleteById(userId);
  },

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const row = await usersRepository.findById(userId);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    if (!row.password_hash) {
      throw new AppError(
        "This account uses social login and has no password.",
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
      );
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new AppError(
        "Passwords do not match",
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
      );
    }

    if (row.two_factor_enabled) {
      if (!dto.totpToken) {
        throw new AppError(
          "2FA code required to change password",
          HttpStatus.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED,
        );
      }
      const isTotpValid = totpService.verifyToken(row.two_factor_secret!, dto.totpToken);
      if (!isTotpValid) {
        throw new AppError(
          "Invalid or expired 2FA code",
          HttpStatus.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED,
        );
      }
    }

    const isValid = await bcrypt.compare(dto.currentPassword, row.password_hash);
    if (!isValid) {
      throw new AppError(
        "Current password is incorrect",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await usersRepository.updatePassword(userId, passwordHash);
  },
};
