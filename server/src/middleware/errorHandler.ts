import type { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";
import { HttpStatus } from "../../../packages/shared/src/constants/httpStatus";
import { logger } from "../config/logger";
import { ErrorCode } from "@books-tracker/shared";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    public errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    logger.warn({
      errorCode: err.errorCode,
      statusCode: err.statusCode,
      message: err.message,
      path: _req.path,
    });
    return ResponseHandler.error(res, err.message, err.statusCode);
  }

  logger.error({ err }, "Unhandled error occurred");
  return ResponseHandler.error(
    res,
    "Internal server error",
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCode.INTERNAL_ERROR,
  );
}
