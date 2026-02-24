import { z } from "zod";
export const PostCardSchema = z.object({
  id: z.ulid(),
  title: z.string().min(5).max(100),
  excerpt: z.string().max(200),
  date: z.iso.datetime(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  imageUrl: z.string().default("/board.png"),
  tags: z.array(z.string()).min(1),
  authorId: z.string().optional().default("unknown"), // Fallback para posts viejos
  author: z.string(),
});

export type PostCard = z.infer<typeof PostCardSchema>;
