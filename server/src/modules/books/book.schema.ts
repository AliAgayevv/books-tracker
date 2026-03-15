import { z } from "zod";

export const createBookSchema = z.object({
  body: z.object({
    olWorkId: z.string().min(1),
    olEditionId: z.string().min(1),
    title: z.string().min(1).max(255),
    author: z.string().max(255).optional(),
    publisher: z.string().max(255).optional(),
    publishedYear: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
    isbn: z.string().max(20).optional(),
    coverUrl: z.string().url().optional(),
    language: z.string().max(50).optional(),
  }),
});

export type createBookSchema = z.infer<typeof createBookSchema>;
