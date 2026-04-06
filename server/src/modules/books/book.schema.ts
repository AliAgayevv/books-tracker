import { z } from "zod";

export const searchBookSchema = z.object({
  q: z.string().min(2).max(200),
  type: z.enum(["title", "author", "isbn"]).default("title"),
});

export type SearchBookSchema = z.infer<typeof searchBookSchema>;
