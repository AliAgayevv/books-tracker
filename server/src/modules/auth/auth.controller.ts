import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import ResponseHandler from "../../utils/responseHandler";
import { AppError } from "../../middleware/errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";
import type { CreateUserDto, LoginDto } from "./auth.types";
import { logger } from "../../config/logger";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateUserDto = req.body;
      const user = await authService.register(dto);

      req.session.userId = user.id;
      req.session.authenticated = true;

      ResponseHandler.created(res, user);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      const result = await authService.login(dto);

      if (result.twoFactorRequired) {
        req.session.pendingUserId = result.user.id;
        req.session.twoFactorPending = true;

        ResponseHandler.success(res, { twoFactorRequired: true });
      } else {
        req.session.userId = result.user.id;
        req.session.authenticated = true;

        ResponseHandler.success(res, result.user);
      }
    } catch (err) {
      next(err);
    }
  },

  // protected by requireTwoFactor middleware.
  // At this point we know pendingUserId and twoFactorPending are set.
  async verifyTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const pendingUserId = req.session.pendingUserId!;

      const user = await authService.verifyTwoFactorLogin(pendingUserId, token);

      // Promote the session from pending to fully authenticated.
      delete req.session.pendingUserId;
      delete req.session.twoFactorPending;
      req.session.userId = user.id;
      req.session.authenticated = true;

      ResponseHandler.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  // GET /me - protected by authenticate middleware.
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authRepository } = await import("./auth.repository");
      const row = await authRepository.findById(req.session.userId!);
      if (!row) {
        return next(new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND));
      }

      ResponseHandler.success(res, {
        id: row.id,
        username: row.username,
        email: row.email,
        twoFactorEnabled: row.two_factor_enabled,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    // delete cookies and destroy server-side session
    req.session.destroy((err) => {
      if (err) {
        logger.error({ err }, "Session destroy failed");
        return next(
          new AppError("Logout failed", HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR),
        );
      }

      res.clearCookie("connect.sid");
      ResponseHandler.success(res, null, "Logged out successfully");
    });
  },

  async googleAuth(_req: Request, _res: Response, _next: NextFunction): Promise<void> {},

  // GET /google/callback — google redirects back here after user approves.
  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(
          new AppError(
            "OAuth authentication failed",
            HttpStatus.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED,
          ),
        );
      }

      const user = req.user as { id: number };
      req.session.userId = user.id;
      req.session.authenticated = true;

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },

  async setupTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.session.userId!;
      const { authRepository } = await import("./auth.repository");
      const row = await authRepository.findById(userId);
      if (!row) {
        return next(new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND));
      }

      const result = await authService.setupTwoFactor(userId, row.username);
      ResponseHandler.success(res, result);
    } catch (err) {
      next(err);
    }
  },

  async enableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await authService.enableTwoFactor(req.session.userId!, token);
      ResponseHandler.success(res, null, "2FA enabled successfully");
    } catch (err) {
      next(err);
    }
  },

  async disableTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await authService.disableTwoFactor(req.session.userId!, token);
      ResponseHandler.success(res, null, "2FA disabled successfully");
    } catch (err) {
      next(err);
    }
  },
};
