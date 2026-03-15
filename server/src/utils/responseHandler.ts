import { ErrorCode } from "../../../packages/shared/src/constants/errorCode";
import type { Response } from "express";
import { HttpStatus, type HttpStatusCode } from "../../../packages/shared/src/constants/httpStatus";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode?: HttpStatusCode;
  data?: T;
  error?: string;
  errorCode?: ErrorCode;
}

class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message = "Request successful",
    statusCode: HttpStatusCode = HttpStatus.OK,
  ): Response {
    const body: ApiResponse<T> = { success: true, message, data, statusCode };
    return res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
  ): Response {
    const body: ApiResponse = {
      success: false,
      message,
      error,
      statusCode,
    };
    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data: T, message = "Resource created successfully"): Response {
    return this.success(res, data, message, HttpStatus.CREATED);
  }

  static notFound(res: Response, message = "Resource not found"): Response {
    return this.error(res, message, HttpStatus.NOT_FOUND);
  }

  static badRequest(res: Response, message = "Bad request", error?: string): Response {
    return this.error(res, message, HttpStatus.BAD_REQUEST, error);
  }

  static unauthorized(res: Response, message = "Unauthorized"): Response {
    return this.error(res, message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(res: Response, message = "Forbidden"): Response {
    return this.error(res, message, HttpStatus.FORBIDDEN);
  }

  static conflict(res: Response, message = "Conflict", error?: string): Response {
    return this.error(res, message, HttpStatus.CONFLICT, error);
  }

  static validationError(res: Response, message = "Validation error", error?: string): Response {
    return this.error(res, message, HttpStatus.BAD_REQUEST, error);
  }

  static internalServerError(
    res: Response,
    message = "Internal server error",
    error?: string,
  ): Response {
    return this.error(res, message, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
export default ResponseHandler;
