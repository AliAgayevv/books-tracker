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