import { z } from "zod";

const GalleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
}).strict();

export const GalleryGridContentSchema = z.object({
  items: z.array(GalleryItemSchema).min(1),
}).strict();

export type GalleryGridContent = z.infer<typeof GalleryGridContentSchema>;
