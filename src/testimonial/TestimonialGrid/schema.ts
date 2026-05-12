// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { AvatarSchema } from "../../shared/schemas";

const TestimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: AvatarSchema.optional(),
}).strict();

export const TestimonialGridContentSchema = z.object({
  heading: z.string(),
  items: z.array(TestimonialItemSchema).min(1),
}).strict();

export type TestimonialGridContent = z.infer<typeof TestimonialGridContentSchema>;
