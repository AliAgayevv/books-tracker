import { ErrorCode } from "../../../packages/shared/src/constants/errorCode";
import type { Response } from "express";
import {
  HttpStatus,
  type HttpStatusCode,
} from "../../../packages/shared/src/constants/httpStatus";

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
}
export default ResponseHandler;
