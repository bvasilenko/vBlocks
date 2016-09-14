import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

const BlogPostSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  category: z.string().optional(),
  image: ImageSchema,
}).strict();

export const BlogGridContentSchema = z.object({
  heading: z.string(),
  posts: z.array(BlogPostSchema).min(1),
}).strict();

export type BlogGridContent = z.infer<typeof BlogGridContentSchema>;
