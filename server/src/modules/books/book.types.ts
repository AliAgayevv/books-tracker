export interface BookRow {
  id: number;
  ol_work_id: string;
  ol_edition_id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  published_year: number | null;
  isbn: string | null;
  cover_url: string | null;
  language: string | null;
  created_at: Date;
}

// Domain object
export interface Book {
  id: number;
  olWorkId: string;
  olEditionId: string;
  title: string;
  author: string | null;
  publisher: string | null;
  publishedYear: number | null;
  isbn: string | null;
  coverUrl: string | null;
  language: string | null;
  createdAt: Date;
}

export interface CreateBookDto {
  olWorkId: string;
  olEditionId: string;
  title: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  coverUrl?: string;
  language?: string;
}
