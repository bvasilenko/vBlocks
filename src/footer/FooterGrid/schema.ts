// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema } from "../../shared/schemas";

const FooterColumnSchema = z.object({
  heading: z.string(),
  links: z.array(CtaSchema).min(1),
}).strict();

export const FooterGridContentSchema = z.object({
  columns: z.array(FooterColumnSchema).min(1).max(6),
  copyright: z.string(),
}).strict();

export type FooterGridContent = z.infer<typeof FooterGridContentSchema>;
