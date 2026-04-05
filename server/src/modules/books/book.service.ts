import { ErrorCode, HttpStatus } from "@books-tracker/shared";
import { AppError } from "../../middleware/errorHandler";
import { bookRepository } from "./book.repository";
import { searchBooks, getEditionForCache } from "./book.openLibrary";
import type { Book, BookRow, BookSearchResult } from "./book.types";

const toBook = (row: BookRow): Book => ({
  id: row.id,
  olWorkId: row.ol_work_id,
  olEditionId: row.ol_edition_id,
  title: row.title,
  author: row.author,
  publisher: row.publisher,
  publishedYear: row.published_year,
  isbn: row.isbn,
  coverUrl: row.cover_url,
  language: row.language,
  createdAt: row.created_at,
});

export const bookService = {
  async getById(id: number): Promise<Book> {
    const row = await bookRepository.findById(id);
    if (!row) {
      throw new AppError("Book not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    return toBook(row);
  },

  async search(query: string, type: "title" | "author" | "isbn"): Promise<BookSearchResult[]> {
    return searchBooks(query, type);
  },

  // Called by the userBooks module when a user adds a book to their shelf.
  // Checks the local cache first; fetches from OpenLibrary and persists only on a miss.
  async findOrCreate(olEditionId: string): Promise<Book> {
    const cached = await bookRepository.findByEditionId(olEditionId);
    if (cached) return toBook(cached);

    const dto = await getEditionForCache(olEditionId);
    if (!dto.olWorkId) {
      throw new AppError(
        "Could not resolve book from OpenLibrary",
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.INVALID_INPUT,
      );
    }

    const row = await bookRepository.create(dto);
    return toBook(row);
  },
};