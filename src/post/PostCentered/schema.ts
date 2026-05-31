// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, TonePillSchema } from "../../shared/schemas";

export const PostCenteredContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string(),
  author: z.string(),
  date: z.string(),
  category: z.string().optional(),
  body: z.string(),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type PostCenteredContent = z.infer<typeof PostCenteredContentSchema>;
