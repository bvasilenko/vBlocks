// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { DensitySchema, TonePillSchema } from "../../shared/schemas";

const GalleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
}).strict();

export const GalleryGridContentSchema = z.object({
  kicker: z.string().optional(),
  eyebrow: z.string().optional(),
  items: z.array(GalleryItemSchema).min(1),
  tonePills: z.array(TonePillSchema).optional(),
  density: DensitySchema.optional(),
}).strict();

export type GalleryGridContent = z.infer<typeof GalleryGridContentSchema>;
