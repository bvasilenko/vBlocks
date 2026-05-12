// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

export const PostCenteredContentSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  category: z.string().optional(),
  body: z.string(),
}).strict();

export type PostCenteredContent = z.infer<typeof PostCenteredContentSchema>;
