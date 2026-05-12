// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";
import { CtaSchema } from "../../shared/schemas";

export const CtaCenteredContentSchema = z.object({
  heading: z.string(),
  description: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema.optional(),
}).strict();

export type CtaCenteredContent = z.infer<typeof CtaCenteredContentSchema>;
