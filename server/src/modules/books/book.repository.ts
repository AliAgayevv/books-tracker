import { pool } from "../../config/db";
import type { BookRow, CreateBookDto } from "./book.types";

export const bookRepository = {
  async findById(id: number): Promise<BookRow | null> {
    const { rows } = await pool.query<BookRow>("SELECT * FROM books WHERE id = $1", [id]);
    return rows[0] ?? null;
  },

  async findByEditionId(olEditionId: string): Promise<BookRow | null> {
    const { rows } = await pool.query<BookRow>("SELECT * FROM books WHERE ol_edition_id = $1", [
      olEditionId,
    ]);
    return rows[0] ?? null;
  },

  async create(dto: CreateBookDto): Promise<BookRow> {
    const { rows } = await pool.query<BookRow>(
      `INSERT INTO books 
        (ol_work_id, ol_edition_id, title, author, publisher, published_year, isbn, cover_url, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        dto.olWorkId,
        dto.olEditionId,
        dto.title,
        dto.author ?? null,
        dto.publisher ?? null,
        dto.publishedYear ?? null,
        dto.isbn ?? null,
        dto.coverUrl ?? null,
        dto.language ?? null,
      ],
    );
    return rows[0];
  },
};
