import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";

export function requireTwoFactor(req: Request, _res: Response, next: NextFunction): void {
  if (req.session.authenticated === true) {
    return next(new AppError("Already authenticated", HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN));
  }

  if (req.session.twoFactorPending !== true || !req.session.pendingUserId) {
    return next(
      new AppError("No pending 2FA verification", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED),
    );
  }

  next();
}
