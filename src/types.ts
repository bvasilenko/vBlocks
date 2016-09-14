import { type ComponentType } from "react";
import { type ZodSchema } from "zod";

export type ThemeOverride = Record<string, string>;

export interface BlockProps<T> {
  content: T;
  theme?: ThemeOverride;
}

export interface BlockMeta<T> {
  schema: ZodSchema<T>;
  default: T;
  component: ComponentType<BlockProps<T>>;
}

export type AnyBlockMeta = BlockMeta<any>;
