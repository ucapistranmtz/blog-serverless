import { z } from "zod";
import { PostCardSchema } from "./postCard.schema";

export const PostDetailSchema = PostCardSchema.extend({
  content: z.string().min(20),
  readingTime: z.number().optional(),
});

export type PostDetail = z.infer<typeof PostDetailSchema>;
