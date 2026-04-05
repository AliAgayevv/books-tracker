import type { Request, Response, NextFunction } from "express";
import type { UpdateUserProfileDto, ChangePasswordDto, DeleteProfileDto } from "./users.types";
import { usersService } from "./users.service";
import ResponseHandler from "../../utils/responseHandler";

export const usersController = {
  async getProfileInformation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getProfileInformation(req.session.userId!);
      ResponseHandler.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async updateProfileInformation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateUserProfileDto = req.body;
      const user = await usersService.updateProfileInformation(req.session.userId!, dto);
      ResponseHandler.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: DeleteProfileDto = req.body;
      await usersService.deleteAccount(req.session.userId!, dto);
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      ResponseHandler.success(res, null, "Account deleted successfully");
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: ChangePasswordDto = req.body;
      await usersService.changePassword(req.session.userId!, dto);
      ResponseHandler.success(res, null, "Password changed successfully");
    } catch (err) {
      next(err);
    }
  },
};
