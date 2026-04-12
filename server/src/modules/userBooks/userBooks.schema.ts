import { z } from "zod";
import { BookStatus } from "@books-tracker/shared";

export const addBookSchema = z.object({
  olEditionId: z.string().min(1),
  status: z.enum(BookStatus),
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().max(5000).optional(),
});

export const updateBookSchema = z
  .object({
    status: z.enum(BookStatus).optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    review: z.string().max(5000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listBooksQuerySchema = z.object({
  status: z.enum(BookStatus).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(["addedAt", "updatedAt", "startedAt", "finishedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
