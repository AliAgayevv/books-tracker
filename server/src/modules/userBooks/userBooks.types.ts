import { BookStatus } from "@books-tracker/shared";

export interface UserBookRow {
  id: number;
  user_id: number;
  book_id: number;
  status: BookStatus;
  rating: number | null;
  review: string | null;
  started_at: Date | null;
  finished_at: Date | null;
  added_at: Date;
  updated_at: Date;
}

export interface UserBookWithBookRow extends UserBookRow {
  ol_work_id: string;
  ol_edition_id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  published_year: number | null;
  isbn: string | null;
  cover_url: string | null;
  language: string | null;
}

export interface AddBookDTO {
  userId: number;
  olEditionId: string;
  status: BookStatus;
  rating?: number;
  review?: string;
}

export interface UpdateBookDTO {
  status?: BookStatus;
  rating?: number | null;
  review?: string | null;
}

export interface ListBooksQuery {
  status?: BookStatus;
  rating?: number;
}

export interface SortingBooksQuery {
  sortBy?: "addedAt" | "updatedAt" | "startedAt" | "finishedAt";
  sortOrder?: "asc" | "desc";
}

export type GetLibraryQuery = ListBooksQuery & SortingBooksQuery;
