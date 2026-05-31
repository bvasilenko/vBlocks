// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, DensitySchema } from "../../shared/schemas";

const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
}).strict();

export const FooterSplitContentSchema = z.object({
  kicker: z.string().optional(),
  brand: BrandSchema,
  links: z.array(CtaSchema).min(1),
  copyright: z.string(),
  density: DensitySchema.optional(),
}).strict();

export type FooterSplitContent = z.infer<typeof FooterSplitContentSchema>;
