import { z } from "zod";

const ServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
}).strict();

export const BusinessGridContentSchema = z.object({
  heading: z.string(),
  services: z.array(ServiceSchema).min(1),
}).strict();

export type BusinessGridContent = z.infer<typeof BusinessGridContentSchema>;
