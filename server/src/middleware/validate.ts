import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError(
          result.error.issues[0]?.message ?? "Validation failed",
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_FAILED,
        ),
      );
    }
    req.body = result.data;
    next();
  };
}
