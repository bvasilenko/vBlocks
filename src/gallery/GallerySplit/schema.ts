// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

const GalleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
}).strict();

export const GallerySplitContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  items: z.array(GalleryItemSchema).min(1),
}).strict();

export type GallerySplitContent = z.infer<typeof GallerySplitContentSchema>;
