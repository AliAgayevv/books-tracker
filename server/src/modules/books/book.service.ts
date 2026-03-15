import { ErrorCode, HttpStatus } from "@books-tracker/shared";
import { AppError } from "../../middleware/errorHandler";
import { bookRepository } from "./book.repository";
import { Book, BookRow, CreateBookDto } from "./book.types";

// snake_case → camelCase
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

  async findOrCreate(dto: CreateBookDto): Promise<Book> {
    const existing = await bookRepository.findByEditionId(dto.olEditionId);
    if (existing) return toBook(existing);

    const row = await bookRepository.create(dto);
    return toBook(row);
  },
};
