export interface BookSearchResult {
  olWorkId: string;
  olEditionId: string;
  title: string;
  author: string | null;
  publishedYear: number | null;
  isbn: string | null;
  coverUrl: string | null;
  language: string | null;
}

export interface UserBookEntry {
  id: number;
  bookId: number;
  review: string | null;
  status: BookStatus;
  rating: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  addedToLibraryAt: string;
  updatedAt: string;
  book: BookSearchResult;
}

export enum BookStatus {
  WANT_TO_READ = "want_to_read",
  CURRENTLY_READING = "currently_reading",
  READ = "read",
}
