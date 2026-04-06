"use client";

import { useState } from "react";
import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";
import { searchBooks, type SearchType } from "../lib/api/books";
import type { BookSearchResult } from "../types";
import { Card, EmptyState, Spinner } from "../components/common";
import { SearchBar } from "../components/common/SearchBar";

export default function SearchSection() {
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (q: string, type: SearchType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchBooks(q, type);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap={6}>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" label="Searching…" />
        </Flex>
      )}

      {!isLoading && error && (
        <EmptyState
          size="md"
          icon={<span>⚠️</span>}
          title="Search failed"
          description={error}
        />
      )}

      {!isLoading && !error && hasSearched && results.length === 0 && (
        <EmptyState
          size="md"
          icon={<span>🔍</span>}
          title="No results found"
          description="Try a different title, author, or ISBN."
        />
      )}

      {!isLoading && results.length > 0 && (
        <Stack gap={4}>
          <Text fontSize="sm" color="fg.muted">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </Text>
          {results.map((book) => (
            <BookResultCard key={book.olEditionId} book={book} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function BookResultCard({ book }: { book: BookSearchResult }) {
  return (
    <Card size="sm">
      <Flex gap={4} align="flex-start">
        <Box
          flexShrink={0}
          width="60px"
          height="88px"
          borderRadius="8px"
          overflow="hidden"
          bg="gray.100"
        >
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              width="60px"
              height="88px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Flex align="center" justify="center" height="100%">
              <BookOpen size={24} color="#9CA3AF" />
            </Flex>
          )}
        </Box>

        <Stack gap={1} flex={1}>
          <Text fontWeight="semibold" fontSize="md" lineClamp={2}>
            {book.title}
          </Text>
          {book.author && (
            <Text fontSize="sm" color="fg.muted">
              {book.author}
            </Text>
          )}
          <Flex gap={3} wrap="wrap" mt={1}>
            {book.publishedYear && (
              <Text fontSize="xs" color="fg.subtle">
                {book.publishedYear}
              </Text>
            )}
            {book.isbn && (
              <Text fontSize="xs" color="fg.subtle">
                ISBN: {book.isbn}
              </Text>
            )}
            {book.language && (
              <Text fontSize="xs" color="fg.subtle" textTransform="uppercase">
                {book.language}
              </Text>
            )}
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
}