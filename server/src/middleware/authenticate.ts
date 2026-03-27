import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  if (req.session.authenticated !== true || !req.session.userId) {
    return next(
      new AppError("Authentication required", HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED),
    );
  }

  next();
}
