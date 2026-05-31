// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, ImageSchema, TonePillSchema } from "../../shared/schemas";

export const PostSplitContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string(),
  author: z.string(),
  date: z.string(),
  category: z.string().optional(),
  body: z.string(),
  image: ImageSchema,
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type PostSplitContent = z.infer<typeof PostSplitContentSchema>;
