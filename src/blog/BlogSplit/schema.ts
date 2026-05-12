// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

const BlogPostSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  category: z.string().optional(),
  image: ImageSchema,
}).strict();

export const BlogSplitContentSchema = z.object({
  heading: z.string(),
  posts: z.array(BlogPostSchema).min(1),
}).strict();

export type BlogSplitContent = z.infer<typeof BlogSplitContentSchema>;
