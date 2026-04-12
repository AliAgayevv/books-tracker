import type { Request, Response, NextFunction } from "express";
import { userBooksService } from "./userBooks.service";
import ResponseHandler from "../../utils/responseHandler";
import type { AddBookDTO, UpdateBookDTO, GetLibraryQuery } from "./userBooks.types";

export const userBooksController = {
  async getLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetLibraryQuery;
      const entries = await userBooksService.getLibrary(req.session.userId!, query);
      ResponseHandler.success(res, entries);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entry = await userBooksService.getOne(req.session.userId!, Number(req.params.id));
      ResponseHandler.success(res, entry);
    } catch (err) {
      next(err);
    }
  },

  async addBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: AddBookDTO = { userId: req.session.userId!, ...req.body };
      const entry = await userBooksService.addBook(req.session.userId!, dto);
      ResponseHandler.created(res, entry, "Book added to library");
    } catch (err) {
      next(err);
    }
  },

  async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateBookDTO = req.body;
      const entry = await userBooksService.updateBook(
        req.session.userId!,
        Number(req.params.id),
        dto,
      );
      ResponseHandler.success(res, entry, "Book updated");
    } catch (err) {
      next(err);
    }
  },

  async removeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userBooksService.removeBook(req.session.userId!, Number(req.params.id));
      ResponseHandler.success(res, null, "Book removed from library");
    } catch (err) {
      next(err);
    }
  },
};
