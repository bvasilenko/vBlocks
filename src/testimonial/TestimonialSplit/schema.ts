// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema } from "../../shared/schemas";

export const TestimonialSplitContentSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: AvatarSchema.optional(),
}).strict();

export type TestimonialSplitContent = z.infer<typeof TestimonialSplitContentSchema>;
