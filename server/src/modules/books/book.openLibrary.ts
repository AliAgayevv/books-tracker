import { logger } from "../../config/logger";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode, HttpStatus } from "@books-tracker/shared";
import type { OLSearchRaw, OLEditionRaw, OLAuthorRaw, BookSearchResult } from "./book.types";
import type { CreateBookDto } from "./book.types";

const OL_BASE = "https://openlibrary.org";
const OL_COVERS = "https://covers.openlibrary.org/b/id";
const SEARCH_LIMIT = 10;

async function olFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    logger.error({ url, err }, "OpenLibrary request failed");
    throw new AppError(
      "Could not reach OpenLibrary",
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR,
    );
  }

  if (!res.ok) {
    logger.error({ url, status: res.status }, "OpenLibrary returned non-OK status");
    throw new AppError(
      "OpenLibrary returned an error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR,
    );
  }

  return res.json() as Promise<T>;
}

function coverUrl(coverId: number, coverQuality: "S" | "M" | "L" = "M"): string {
  return `${OL_COVERS}/${coverId}-${coverQuality}.jpg`;
}

function mapSearchDoc(doc: OLSearchRaw): BookSearchResult | null {
  const editionId = doc.edition_key?.[0];
  if (!editionId) return null;

  const olWorkId = doc.key.replace("/works/", "");

  return {
    olWorkId,
    olEditionId: editionId,
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    publishedYear: doc.first_publish_year ?? null,
    isbn: doc.isbn?.[0] ?? null,
    coverUrl: doc.cover_i ? coverUrl(doc.cover_i, "M") : null,
    language: doc.language?.[0] ?? null,
  };
}

export async function searchBooks(
  query: string,
  type: "title" | "author" | "isbn",
): Promise<BookSearchResult[]> {
  const fields =
    "key,title,author_name,first_publish_year,isbn,publisher,cover_i,language,edition_key";
  const url = `${OL_BASE}/search.json?${type}=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&fields=${fields}`;

  const data = await olFetch<{ docs: OLSearchRaw[] }>(url);

  return data.docs.map(mapSearchDoc).filter((r): r is BookSearchResult => r !== null);
}

export async function getEditionForCache(olEditionId: string): Promise<CreateBookDto> {
  const editionUrl = `${OL_BASE}/books/${olEditionId}.json`;
  const edition = await olFetch<OLEditionRaw>(editionUrl);

  let authorName: string | undefined;
  const authorKey = edition.authors?.[0]?.key;
  if (authorKey) {
    const key = authorKey.split("/").pop();
    try {
      const author = await olFetch<OLAuthorRaw>(`${OL_BASE}/authors/${key}.json`);
      authorName = author.name;
    } catch {
      logger.error({ authorKey }, "Failed to fetch author from OpenLibrary, continuing without");
    }
  }

  const olWorkId = edition.works?.[0]?.key?.replace("/works/", "") ?? "";

  const yearStr = edition.publish_date?.match(/\d{4}/)?.[0];
  const publishedYear = yearStr ? parseInt(yearStr, 10) : undefined;

  const languageKey = edition.languages?.[0]?.key;
  const language = languageKey ? (languageKey.split("/").pop() ?? undefined) : undefined;

  return {
    olWorkId,
    olEditionId,
    title: edition.title,
    author: authorName,
    publisher: edition.publishers?.[0],
    publishedYear,
    isbn: edition.isbn_13?.[0] ?? edition.isbn_10?.[0],
    coverUrl: edition.covers?.[0] ? coverUrl(edition.covers[0]) : undefined,
    language,
  };
}
