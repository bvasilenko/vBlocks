// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, DensitySchema } from "../../shared/schemas";

const FooterColumnSchema = z.object({
  heading: z.string(),
  links: z.array(CtaSchema).min(1),
}).strict();

export const FooterGridContentSchema = z.object({
  kicker: z.string().optional(),
  columns: z.array(FooterColumnSchema).min(1).max(6),
  copyright: z.string(),
  density: DensitySchema.optional(),
}).strict();

export type FooterGridContent = z.infer<typeof FooterGridContentSchema>;
