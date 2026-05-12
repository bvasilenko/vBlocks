// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

export const CtaSchema = z.object({
  label: z.string(),
  href: z.string(),
}).strict();

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
}).strict();

export const AvatarSchema = ImageSchema;

export type Cta = z.infer<typeof CtaSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type AvatarSrc = Image;
