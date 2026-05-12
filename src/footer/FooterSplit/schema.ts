// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema } from "../../shared/schemas";

const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
}).strict();

export const FooterSplitContentSchema = z.object({
  brand: BrandSchema,
  links: z.array(CtaSchema).min(1),
  copyright: z.string(),
}).strict();

export type FooterSplitContent = z.infer<typeof FooterSplitContentSchema>;
