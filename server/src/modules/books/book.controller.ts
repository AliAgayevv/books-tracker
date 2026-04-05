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

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, type } = req.query as { q: string; type: "title" | "author" | "isbn" };
      const results = await bookService.search(q, type);
      ResponseHandler.success(res, results, "Search results", HttpStatus.OK);
    } catch (err) {
      next(err);
    }
  },
};