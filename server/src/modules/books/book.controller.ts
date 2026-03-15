import type { Request, Response, NextFunction } from "express";
import { bookService } from "./book.service";
import ResponseHandler from "../../utils/responseHandler";
import { HttpStatus } from "@books-tracker/shared";

export const bookController = {
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.getById(Number(req.params.id));
      ResponseHandler.success(res, book);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.findOrCreate(req.body);
      ResponseHandler.success(res, book, "Book created", HttpStatus.CREATED);
    } catch (err) {
      next(err);
    }
  },
};
