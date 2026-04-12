import { pool } from "../../config/db";
import type {
  UserBookRow,
  UserBookWithBookRow,
  UpdateBookDTO,
  GetLibraryQuery,
} from "./userBooks.types";
import type { BookStatus } from "@books-tracker/shared";

const SORT_COLUMN_MAP: Record<string, string> = {
  addedAt: "ub.added_at",
  updatedAt: "ub.updated_at",
  startedAt: "ub.started_at",
  finishedAt: "ub.finished_at",
};

export const userBooksRepository = {
  async findAllByUser(userId: number, query: GetLibraryQuery): Promise<UserBookWithBookRow[]> {
    const conditions: string[] = ["ub.user_id = $1"];
    const params: unknown[] = [userId];

    if (query.status) {
      params.push(query.status);
      conditions.push(`ub.status = $${params.length}`);
    }

    if (query.rating) {
      params.push(query.rating);
      conditions.push(`ub.rating = $${params.length}`);
    }

    const sortCol = SORT_COLUMN_MAP[query.sortBy ?? ""] ?? "ub.added_at";
    const sortDir = query.sortOrder === "asc" ? "ASC" : "DESC";

    const { rows } = await pool.query<UserBookWithBookRow>(
      `SELECT
        ub.id, ub.user_id, ub.book_id, ub.status, ub.rating, ub.review,
        ub.started_at, ub.finished_at, ub.added_at, ub.updated_at,
        b.ol_work_id, b.ol_edition_id, b.title, b.author,
        b.published_year, b.isbn, b.cover_url, b.language
       FROM user_books ub
       JOIN books b ON b.id = ub.book_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY ${sortCol} ${sortDir}`,
      params,
    );
    return rows;
  },

  async findById(id: number, userId: number): Promise<UserBookWithBookRow | null> {
    const { rows } = await pool.query<UserBookWithBookRow>(
      `SELECT
        ub.id, ub.user_id, ub.book_id, ub.status, ub.rating, ub.review,
        ub.started_at, ub.finished_at, ub.added_at, ub.updated_at,
        b.ol_work_id, b.ol_edition_id, b.title, b.author,
        b.published_year, b.isbn, b.cover_url, b.language
       FROM user_books ub
       JOIN books b ON b.id = ub.book_id
       WHERE ub.id = $1 AND ub.user_id = $2`,
      [id, userId],
    );
    return rows[0] ?? null;
  },

  async findByUserAndBook(userId: number, bookId: number): Promise<UserBookRow | null> {
    const { rows } = await pool.query<UserBookRow>(
      "SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2",
      [userId, bookId],
    );
    return rows[0] ?? null;
  },

  async create(
    userId: number,
    bookId: number,
    status: BookStatus,
    rating: number | null,
    review: string | null,
    startedAt: Date | null,
  ): Promise<UserBookRow> {
    const { rows } = await pool.query<UserBookRow>(
      `INSERT INTO user_books (user_id, book_id, status, rating, review, started_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, bookId, status, rating ?? null, review ?? null, startedAt],
    );
    return rows[0];
  },

  async update(id: number, userId: number, dto: UpdateBookDTO): Promise<UserBookRow | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (dto.status !== undefined) {
      params.push(dto.status);
      fields.push(`status = $${params.length}`);
    }
    if (dto.rating !== undefined) {
      params.push(dto.rating);
      fields.push(`rating = $${params.length}`);
    }
    if (dto.review !== undefined) {
      params.push(dto.review);
      fields.push(`review = $${params.length}`);
    }
    if (dto.status === "currently_reading") {
      fields.push(`started_at = COALESCE(started_at, NOW())`);
    }
    if (dto.status === "read") {
      fields.push(`finished_at = COALESCE(finished_at, NOW())`);
    }

    fields.push(`updated_at = NOW()`);

    params.push(id, userId);
    const { rows } = await pool.query<UserBookRow>(
      `UPDATE user_books
       SET ${fields.join(", ")}
       WHERE id = $${params.length - 1} AND user_id = $${params.length}
       RETURNING *`,
      params,
    );
    return rows[0] ?? null;
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM user_books WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
    return (rowCount ?? 0) > 0;
  },
};
