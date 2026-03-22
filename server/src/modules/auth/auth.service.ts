import bcrypt from "bcrypt";
import { authRepository } from "./auth.repository";
import { AppError } from "../../middleware/errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";
import type { CreateUserDto, LoginDto, User, UserRow } from "./auth.types";
import { logger } from "../../config/logger";

const SALT_ROUNDS = 12;

function toUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const authService = {
  async register(dto: CreateUserDto): Promise<User> {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) {
      logger.warn({ email: dto.email }, "Attempt to register with existing email");
      throw new AppError("Email already in use", HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS);
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const row = await authRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    return toUser(row);
  },

  async login(dto: LoginDto): Promise<User> {
    const row = await authRepository.findByEmail(dto.email);
    if (!row) {
      throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(dto.password, row.password_hash);
    if (!isValid) {
      throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    return toUser(row);
  },
};
