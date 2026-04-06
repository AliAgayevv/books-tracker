import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { HttpStatus, ErrorCode } from "@books-tracker/shared";

function validationError(err: z.ZodError): AppError {
  return new AppError(
    err.issues[0]?.message ?? "Validation failed",
    HttpStatus.BAD_REQUEST,
    ErrorCode.VALIDATION_FAILED,
  );
}

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(validationError(result.error));
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) return next(validationError(result.error));
    Object.assign(req.query, result.data);
    next();
  };
}
