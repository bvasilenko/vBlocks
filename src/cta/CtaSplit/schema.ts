// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema, ImageSchema } from "../../shared/schemas";

export const CtaSplitContentSchema = z.object({
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  image: ImageSchema,
}).strict();

export type CtaSplitContent = z.infer<typeof CtaSplitContentSchema>;
