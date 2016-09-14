import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

const ContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
}).strict();

export const BusinessSplitContentSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  image: ImageSchema,
  contact: ContactSchema.optional(),
}).strict();

export type BusinessSplitContent = z.infer<typeof BusinessSplitContentSchema>;
