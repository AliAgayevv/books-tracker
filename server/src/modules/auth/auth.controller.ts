import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import ResponseHandler from "../../utils/responseHandler";
import type { CreateUserDto, LoginDto } from "./auth.types";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateUserDto = req.body;
      const user = await authService.register(dto);
      ResponseHandler.created(res, user);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      const user = await authService.login(dto);
      ResponseHandler.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async getCurrentUser(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    // TODO: Will be implemented after JWT authentication middleware is added
    next();
  },

  async logout(_req: Request, res: Response): Promise<void> {
    // TODO: Will be implemented after JWT authentication middleware is added
    ResponseHandler.success(res, null, "Logged out successfully");
  },
};
