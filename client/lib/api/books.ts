import type { BookSearchResult } from "@books-tracker/shared";

export type { BookSearchResult };
export type SearchType = "title" | "author" | "isbn";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export async function searchBooks(
  q: string,
  type: SearchType = "title"
): Promise<BookSearchResult[]> {
  const params = new URLSearchParams({ q, type });
  const res = await fetch(`/api/books/search?${params.toString()}`, {
    credentials: "include",
  });

  const body: ApiResponse<BookSearchResult[]> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Search failed");
  }

  return body.data;
}
