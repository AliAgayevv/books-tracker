// Open Library API raw responses
export interface OLSearchRaw {
  key: string; // "/works/OL45804W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  publisher?: string[];
  cover_i?: number;
  language?: string[];
  edition_key?: string[]; // ["OL7353617M", ...]
}

export interface OLEditionRaw {
  title: string;
  works?: { key: string }[]; // [{ key: "/works/OL45804W" }]
  authors?: { key: string }[]; // [{ key: "/authors/OL34184A" }]
  publishers?: string[];
  publish_date?: string; // "2001", "April 2001", etc.
  isbn_13?: string[];
  isbn_10?: string[];
  covers?: number[];
  languages?: { key: string }[]; // [{ key: "/languages/eng" }]
}

export interface OLAuthorRaw {
  name?: string;
}

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
