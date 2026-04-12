import type { UserBookEntry, BookStatus } from "@books-tracker/shared";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Request failed");
  }

  return body.data;
}

export interface GetLibraryParams {
  status?: BookStatus;
  rating?: number;
  sortBy?: "addedAt" | "updatedAt" | "startedAt" | "finishedAt";
  sortOrder?: "asc" | "desc";
}

export function getLibrary(params: GetLibraryParams = {}): Promise<UserBookEntry[]> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.rating) qs.set("rating", String(params.rating));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const query = qs.toString();
  return request<UserBookEntry[]>(`/api/user-books${query ? `?${query}` : ""}`);
}

export function getLibraryEntry(id: number): Promise<UserBookEntry> {
  return request<UserBookEntry>(`/api/user-books/${id}`);
}

export function addBook(payload: {
  olEditionId: string;
  status: BookStatus;
  rating?: number;
  review?: string;
}): Promise<UserBookEntry> {
  return request<UserBookEntry>("/api/user-books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBook(
  id: number,
  payload: { status?: BookStatus; rating?: number | null; review?: string | null },
): Promise<UserBookEntry> {
  return request<UserBookEntry>(`/api/user-books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removeBook(id: number): Promise<void> {
  return request<void>(`/api/user-books/${id}`, { method: "DELETE" });
}
