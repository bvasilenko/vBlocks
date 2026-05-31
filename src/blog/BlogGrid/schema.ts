// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

const BlogPostSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  category: z.string().optional(),
  image: ImageSchema,
}).strict();

export const BlogGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  posts: z.array(BlogPostSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type BlogGridContent = z.infer<typeof BlogGridContentSchema>;
