import { z } from "zod";
import { ImageSchema } from "../../shared/schemas";

const PortfolioItemSchema = z.object({
  title: z.string(),
  category: z.string(),
  image: ImageSchema,
}).strict();

export const PortfolioSplitContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  items: z.array(PortfolioItemSchema).min(1),
}).strict();

export type PortfolioSplitContent = z.infer<typeof PortfolioSplitContentSchema>;
