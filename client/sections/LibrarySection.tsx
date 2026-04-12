"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Stack, Text, Select, createListCollection, Textarea } from "@chakra-ui/react";
import { BookOpen, Trash2, Star } from "lucide-react";
import { BookStatus, type UserBookEntry } from "@books-tracker/shared";
import { getLibrary, updateBook, removeBook, type GetLibraryParams } from "../lib/api/userBooks";
import { Badge, Button, Card, EmptyState, Spinner } from "../components/common";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Want to Read", value: BookStatus.WANT_TO_READ },
    { label: "Currently Reading", value: BookStatus.CURRENTLY_READING },
    { label: "Read", value: BookStatus.READ },
  ],
});

const STATUS_FILTER_OPTIONS = createListCollection({
  items: [
    { label: "All", value: "" },
    { label: "Want to Read", value: BookStatus.WANT_TO_READ },
    { label: "Currently Reading", value: BookStatus.CURRENTLY_READING },
    { label: "Read", value: BookStatus.READ },
  ],
});

const SORT_BY_OPTIONS = createListCollection({
  items: [
    { label: "Date Added", value: "addedAt" },
    { label: "Last Updated", value: "updatedAt" },
    { label: "Started At", value: "startedAt" },
    { label: "Finished At", value: "finishedAt" },
  ],
});

const SORT_ORDER_OPTIONS = createListCollection({
  items: [
    { label: "Newest First", value: "desc" },
    { label: "Oldest First", value: "asc" },
  ],
});

export default function LibrarySection() {
  const [entries, setEntries] = useState<UserBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetLibraryParams>({ sortBy: "addedAt", sortOrder: "desc" });

  const fetchLibrary = async (p: GetLibraryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLibrary(p);
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load library");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary(params);
  }, [params]);

  const handleUpdate = (updated: UserBookEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleRemove = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <Stack gap={6}>
      {/* Filters & Sort */}
      <Flex gap={3} wrap="wrap" align="center">
        <Select.Root
          collection={STATUS_FILTER_OPTIONS}
          value={[params.status ?? ""]}
          onValueChange={(e) =>
            setParams((p) => ({ ...p, status: (e.value[0] as BookStatus) || undefined }))
          }
          size="sm"
          width="160px"
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Filter by status" />
          </Select.Trigger>
          <Select.Content>
            {STATUS_FILTER_OPTIONS.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          collection={SORT_BY_OPTIONS}
          value={[params.sortBy ?? "addedAt"]}
          onValueChange={(e) =>
            setParams((p) => ({ ...p, sortBy: e.value[0] as GetLibraryParams["sortBy"] }))
          }
          size="sm"
          width="160px"
        >
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.Content>
            {SORT_BY_OPTIONS.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          collection={SORT_ORDER_OPTIONS}
          value={[params.sortOrder ?? "desc"]}
          onValueChange={(e) =>
            setParams((p) => ({ ...p, sortOrder: e.value[0] as "asc" | "desc" }))
          }
          size="sm"
          width="150px"
        >
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.Content>
            {SORT_ORDER_OPTIONS.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {isLoading && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" label="Loading library…" />
        </Flex>
      )}

      {!isLoading && error && (
        <EmptyState size="md" icon={<span>⚠️</span>} title="Failed to load" description={error} />
      )}

      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          size="md"
          icon={<span>📚</span>}
          title="No books yet"
          description="Search for a book and add it to your library."
        />
      )}

      {!isLoading && entries.length > 0 && (
        <Stack gap={4}>
          <Text fontSize="sm" color="fg.muted">
            {entries.length} book{entries.length !== 1 ? "s" : ""}
          </Text>
          {entries.map((entry) => (
            <LibraryEntryCard
              key={entry.id}
              entry={entry}
              onUpdate={handleUpdate}
              onRemove={() => handleRemove(entry.id)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function LibraryEntryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: UserBookEntry;
  onUpdate: (updated: UserBookEntry) => void;
  onRemove: () => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState(entry.review ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: BookStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateBook(entry.id, { status: newStatus });
      onUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRatingChange = async (rating: number) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateBook(entry.id, { rating });
      onUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReviewSave = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateBook(entry.id, { review: reviewText || null });
      onUpdate(updated);
      setShowReview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeBook(entry.id);
      onRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
      setIsRemoving(false);
    }
  };

  return (
    <Card size="sm">
      <Flex gap={4} align="flex-start">
        <Box flexShrink={0} width="60px" height="88px" borderRadius="8px" overflow="hidden" bg="gray.100">
          {entry.book.coverUrl ? (
            <Image src={entry.book.coverUrl} alt={entry.book.title} width="60px" height="88px" style={{ objectFit: "cover" }} />
          ) : (
            <Flex align="center" justify="center" height="100%">
              <BookOpen size={24} color="#9CA3AF" />
            </Flex>
          )}
        </Box>

        <Stack gap={2} flex={1}>
          <Flex justify="space-between" align="flex-start" gap={2}>
            <Stack gap={0}>
              <Text fontWeight="semibold" fontSize="md" lineClamp={2}>
                {entry.book.title}
              </Text>
              {entry.book.author && (
                <Text fontSize="sm" color="fg.muted">{entry.book.author}</Text>
              )}
            </Stack>
            <Button
              size="sm"
              variant="outline"
              colorScheme="yellow"
              isLoading={isRemoving}
              onClick={handleRemove}
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </Button>
          </Flex>

          {/* Status */}
          <Flex align="center" gap={3} wrap="wrap">
            <Badge status={entry.status} size="sm" />
            <Select.Root
              collection={STATUS_OPTIONS}
              value={[entry.status]}
              onValueChange={(e) => handleStatusChange(e.value[0] as BookStatus)}
              size="sm"
              width="170px"
              disabled={isUpdating}
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
          </Flex>

          {/* Rating */}
          <HalfStarRating
            value={entry.rating}
            onChange={handleRatingChange}
            disabled={isUpdating}
          />

          {/* Review */}
          {showReview ? (
            <Stack gap={2}>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review…"
                size="sm"
                rows={3}
              />
              <Flex gap={2}>
                <Button size="sm" colorScheme="purple" isLoading={isUpdating} onClick={handleReviewSave}>
                  Save
                </Button>
                <Button size="sm" colorScheme="yellow" variant="outline" onClick={() => setShowReview(false)}>
                  Cancel
                </Button>
              </Flex>
            </Stack>
          ) : (
            <Stack gap={1}>
              {entry.review && (
                <Text fontSize="sm" color="fg.muted" fontStyle="italic" lineClamp={2}>
                  "{entry.review}"
                </Text>
              )}
              <Box>
                <Button size="sm" variant="outline" colorScheme="purple" onClick={() => setShowReview(true)}>
                  {entry.review ? "Edit Review" : "Add Review"}
                </Button>
              </Box>
            </Stack>
          )}

          {error && <Text fontSize="xs" color="red.500">{error}</Text>}

          <Text fontSize="xs" color="fg.subtle">
            Added {new Date(entry.addedToLibraryAt).toLocaleDateString()}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}

function HalfStarRating({
  value,
  onChange,
  disabled,
}: {
  value: number | null;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayed = hovered ?? value ?? 0;
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <Flex align="center" gap="2px">
      {[1, 2, 3, 4, 5].map((star) => {
        const leftVal = star === 1 ? 1 : star - 0.5;
        const rightVal = star;
        const leftFilled = displayed >= leftVal;
        const rightFilled = displayed >= rightVal;

        return (
          <Box key={star} position="relative" width="20px" height="20px" flexShrink={0}>
            {/* Left half */}
            <Box
              position="absolute" top="0" left="0"
              width="50%" height="100%"
              overflow="hidden"
              color={leftFilled ? "orange.400" : "gray.300"}
              pointerEvents="none"
            >
              <Star size={20} fill={leftFilled ? "currentColor" : "none"} strokeWidth={1.5}
                style={{ position: "absolute", left: 0, top: 0 }} />
            </Box>
            {/* Right half */}
            <Box
              position="absolute" top="0" right="0"
              width="50%" height="100%"
              overflow="hidden"
              color={rightFilled ? "orange.400" : "gray.300"}
              pointerEvents="none"
            >
              <Star size={20} fill={rightFilled ? "currentColor" : "none"} strokeWidth={1.5}
                style={{ position: "absolute", right: 0, top: 0 }} />
            </Box>
            {/* Interaction layer */}
            <Flex position="absolute" top="0" left="0" width="100%" height="100%">
              <Box flex={1} cursor={disabled ? "default" : "pointer"}
                onMouseEnter={() => !disabled && setHovered(leftVal)}
                onMouseLeave={handleMouseLeave}
                onClick={() => !disabled && onChange(leftVal)} />
              <Box flex={1} cursor={disabled ? "default" : "pointer"}
                onMouseEnter={() => !disabled && setHovered(rightVal)}
                onMouseLeave={handleMouseLeave}
                onClick={() => !disabled && onChange(rightVal)} />
            </Flex>
          </Box>
        );
      })}
      {value !== null && (
        <Text fontSize="xs" color="fg.muted" ml={2}>{value}/5</Text>
      )}
    </Flex>
  );
}
