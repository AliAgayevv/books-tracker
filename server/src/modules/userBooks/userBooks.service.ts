import { BookStatus, ErrorCode, HttpStatus, type UserBookEntry } from "@books-tracker/shared";
import { AppError } from "../../middleware/errorHandler";
import { bookService } from "../books/book.service";
import { userBooksRepository } from "./userBooks.repository";
import type { AddBookDTO, UpdateBookDTO, GetLibraryQuery, UserBookWithBookRow } from "./userBooks.types";

function toUserBookEntry(row: UserBookWithBookRow): UserBookEntry {
  return {
    id: row.id,
    bookId: row.book_id,
    status: row.status,
    rating: row.rating as 1 | 2 | 3 | 4 | 5 | null,
    review: row.review,
    startedAt: row.started_at ? row.started_at.toISOString() : null,
    finishedAt: row.finished_at ? row.finished_at.toISOString() : null,
    addedToLibraryAt: row.added_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    book: {
      olWorkId: row.ol_work_id,
      olEditionId: row.ol_edition_id,
      title: row.title,
      author: row.author,
      publishedYear: row.published_year,
      isbn: row.isbn,
      coverUrl: row.cover_url,
      language: row.language,
    },
  };
}

export const userBooksService = {
  async getLibrary(userId: number, query: GetLibraryQuery): Promise<UserBookEntry[]> {
    const rows = await userBooksRepository.findAllByUser(userId, query);
    return rows.map(toUserBookEntry);
  },

  async getOne(userId: number, entryId: number): Promise<UserBookEntry> {
    const row = await userBooksRepository.findById(entryId, userId);
    if (!row) {
      throw new AppError(
        "Book not found in your library",
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
      );
    }
    return toUserBookEntry(row);
  },

  async addBook(userId: number, dto: AddBookDTO): Promise<UserBookEntry> {
    const book = await bookService.findOrCreate(dto.olEditionId);

    const existing = await userBooksRepository.findByUserAndBook(userId, book.id);
    if (existing) {
      throw new AppError(
        "Book already in your library",
        HttpStatus.CONFLICT,
        ErrorCode.ALREADY_EXISTS,
      );
    }

    const startedAt = dto.status === BookStatus.CURRENTLY_READING ? new Date() : null;

    const row = await userBooksRepository.create(
      userId,
      book.id,
      dto.status,
      dto.rating ?? null,
      dto.review ?? null,
      startedAt,
    );

    // create() returns a plain UserBookRow — fetch the full joined row for the response
    const fullRow = await userBooksRepository.findById(row.id, userId);
    return toUserBookEntry(fullRow!);
  },

  async updateBook(userId: number, entryId: number, dto: UpdateBookDTO): Promise<UserBookEntry> {
    await this.getOne(userId, entryId);

    const updated = await userBooksRepository.update(entryId, userId, dto);
    if (!updated) {
      throw new AppError(
        "Book not found in your library",
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
      );
    }

    const fullRow = await userBooksRepository.findById(updated.id, userId);
    return toUserBookEntry(fullRow!);
  },

  async removeBook(userId: number, entryId: number): Promise<void> {
    await this.getOne(userId, entryId);
    await userBooksRepository.remove(entryId, userId);
  },
};
