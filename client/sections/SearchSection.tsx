"use client";

import { useState } from "react";
import { Box, Flex, Image, Stack, Text, Select, createListCollection } from "@chakra-ui/react";
import { BookOpen, Plus, Check } from "lucide-react";
import { BookStatus } from "@books-tracker/shared";
import { searchBooks, type SearchType } from "../lib/api/books";
import { addBook } from "../lib/api/userBooks";
import type { BookSearchResult } from "../types";
import { Button, Card, EmptyState, Spinner } from "../components/common";
import { SearchBar } from "../components/common/SearchBar";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Want to Read", value: BookStatus.WANT_TO_READ },
    { label: "Currently Reading", value: BookStatus.CURRENTLY_READING },
    { label: "Read", value: BookStatus.READ },
  ],
});

export default function SearchSection() {
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

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

  const handleAdded = (olEditionId: string) => {
    setAdded((prev) => new Set(prev).add(olEditionId));
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
        <EmptyState size="md" icon={<span>⚠️</span>} title="Search failed" description={error} />
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
            <BookResultCard
              key={book.olEditionId}
              book={book}
              isAdded={added.has(book.olEditionId)}
              onAdded={() => handleAdded(book.olEditionId)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function BookResultCard({
  book,
  isAdded,
  onAdded,
}: {
  book: BookSearchResult;
  isAdded: boolean;
  onAdded: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<BookStatus>(BookStatus.WANT_TO_READ);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await addBook({ olEditionId: book.olEditionId, status });
      onAdded();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card size="sm">
      <Flex gap={4} align="flex-start">
        <Box flexShrink={0} width="60px" height="88px" borderRadius="8px" overflow="hidden" bg="gray.100">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={book.title} width="60px" height="88px" style={{ objectFit: "cover" }} />
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
            {book.publishedYear && <Text fontSize="xs" color="fg.subtle">{book.publishedYear}</Text>}
            {book.isbn && <Text fontSize="xs" color="fg.subtle">ISBN: {book.isbn}</Text>}
            {book.language && <Text fontSize="xs" color="fg.subtle" textTransform="uppercase">{book.language}</Text>}
          </Flex>

          {isAdded ? (
            <Flex align="center" gap={1} mt={2}>
              <Check size={14} color="green" />
              <Text fontSize="xs" color="green.500">Added to library</Text>
            </Flex>
          ) : showForm ? (
            <Stack gap={2} mt={2}>
              <Select.Root
                collection={STATUS_OPTIONS}
                value={[status]}
                onValueChange={(e) => setStatus(e.value[0] as BookStatus)}
                size="sm"
              >
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.Content>
                  {STATUS_OPTIONS.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {error && <Text fontSize="xs" color="red.500">{error}</Text>}
              <Flex gap={2}>
                <Button size="sm" colorScheme="purple" isLoading={isSubmitting} onClick={handleAdd}>
                  Add
                </Button>
                <Button size="sm" colorScheme="yellow" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </Flex>
            </Stack>
          ) : (
            <Box mt={2}>
              <Button size="sm" colorScheme="purple" leftIcon={<Plus size={13} />} onClick={() => setShowForm(true)}>
                Add to Library
              </Button>
            </Box>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
