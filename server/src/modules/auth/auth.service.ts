import bcrypt from "bcrypt";
import type { Profile } from "passport-google-oauth20";
import { authRepository } from "./auth.repository";
import { oauthRepository } from "./oauth.repository";
import { totpService } from "./totp.service";
import { AppError } from "../../middleware/errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";
import type {
  CreateUserDto,
  LoginDto,
  LoginResult,
  TwoFactorSetupResult,
  User,
  UserRow,
} from "./auth.types";
import { logger } from "../../config/logger";

const SALT_ROUNDS = 12;

// DONT SEND TWO_FACTOR_SECRET OR PASSWORD_HASH TO THE CLIENT! Always convert to a safe User type first.
function toUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    twoFactorEnabled: row.two_factor_enabled,
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

  async login(dto: LoginDto): Promise<LoginResult> {
    const row = await authRepository.findByEmail(dto.email);
    if (!row) {
      // Don't reveal whether the email is registered or not — just say "invalid credentials".
      throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    // After the 002 migration, OAuth users have no password. If someone tries
    // to log in with an email that belongs to an OAuth account, we must reject
    // it explicitly. Without this check, bcrypt.compare(password, null) would
    // throw an unhandled error.
    if (!row.password_hash) {
      throw new AppError(
        "This account uses social login. Please sign in with Google.",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    const isValid = await bcrypt.compare(dto.password, row.password_hash);
    if (!isValid) {
      throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    return {
      user: toUser(row),
      // The controller will write a different session state based on this flag:
      // true  → { pendingUserId, twoFactorPending: true }   (partial auth)
      // false → { userId, authenticated: true }             (full auth)
      twoFactorRequired: row.two_factor_enabled,
    };
  },

  async setupTwoFactor(userId: number, username: string): Promise<TwoFactorSetupResult> {
    const result = await totpService.generateSecret(username);

    await authRepository.updateTwoFactorSecret(userId, result.secret);

    logger.info({ userId }, "2FA secret generated");
    return result;
  },

  async enableTwoFactor(userId: number, token: string): Promise<void> {
    const row = await authRepository.findById(userId);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    if (!row.two_factor_secret) {
      throw new AppError(
        "2FA setup not started. Call /2fa/setup first.",
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
      );
    }

    if (row.two_factor_enabled) {
      throw new AppError("2FA is already enabled", HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS);
    }

    const isValid = totpService.verifyToken(row.two_factor_secret, token);
    if (!isValid) {
      throw new AppError(
        "Invalid or expired TOTP code",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    await authRepository.enableTwoFactor(userId);
    logger.info({ userId }, "2FA enabled");
  },

  async disableTwoFactor(userId: number, token: string): Promise<void> {
    const row = await authRepository.findById(userId);
    if (!row) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    if (!row.two_factor_enabled || !row.two_factor_secret) {
      throw new AppError("2FA is not enabled", HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_FAILED);
    }

    const isValid = totpService.verifyToken(row.two_factor_secret, token);
    if (!isValid) {
      throw new AppError(
        "Invalid or expired TOTP code",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    await authRepository.disableTwoFactor(userId);
    logger.info({ userId }, "2FA disabled");
  },

  async verifyTwoFactorLogin(pendingUserId: number, token: string): Promise<User> {
    const row = await authRepository.findById(pendingUserId);
    if (!row || !row.two_factor_secret) {
      throw new AppError("Invalid session state", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    const isValid = totpService.verifyToken(row.two_factor_secret, token);
    if (!isValid) {
      throw new AppError(
        "Invalid or expired TOTP code",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    return toUser(row);
  },

  //

  async getOAuthOrCreateUser(profile: Profile): Promise<User> {
    // Have we seen this exact Google account before?
    const existingOAuth = await oauthRepository.findByProvider("google", profile.id);
    if (existingOAuth) {
      // we know this Google ID -> look up the linked user directly.
      const row = await authRepository.findById(existingOAuth.user_id);
      if (!row) {
        throw new AppError("Linked user not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      return toUser(row);
    }

    // New Google account - check if the email is already registered.
    // A user might have registered with email+password and later tries to sign
    // in with Google using the same email address. Without linking, they'd get
    // a duplicate account. Linking by email merges them
    const email = profile.emails?.[0]?.value ?? null;
    let userRow: UserRow;

    if (email) {
      const existingUser = await authRepository.findByEmail(email);

      if (existingUser) {
        await oauthRepository.create({
          userId: existingUser.id,
          provider: "google",
          providerId: profile.id,
          email,
        });
        userRow = existingUser;
      } else {
        userRow = await authRepository.createOAuthUser({
          username: profile.displayName || email,
          email,
        });
        await oauthRepository.create({
          userId: userRow.id,
          provider: "google",
          providerId: profile.id,
          email,
        });
      }
    } else {
      userRow = await authRepository.createOAuthUser({
        username: profile.displayName || `google_${profile.id}`,
        email: "",
      });
      await oauthRepository.create({
        userId: userRow.id,
        provider: "google",
        providerId: profile.id,
        email: null,
      });
    }

    logger.info({ userId: userRow.id, provider: "google" }, "OAuth user created or linked");
    return toUser(userRow);
  },
};
