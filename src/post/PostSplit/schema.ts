// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

export const PostSplitContentSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  category: z.string().optional(),
  body: z.string(),
  image: ImageSchema,
}).strict();

export type PostSplitContent = z.infer<typeof PostSplitContentSchema>;
