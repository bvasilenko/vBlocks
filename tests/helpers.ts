// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { z } from "zod";

export function shapeOf(schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> {
  return (schema as z.AnyZodObject).shape as Record<string, z.ZodTypeAny>;
}

export function requiredKeysOf(shape: Record<string, z.ZodTypeAny>): string[] {
  return Object.keys(shape).filter((k) => !shape[k].safeParse(undefined).success);
}

export function optionalKeysOf(shape: Record<string, z.ZodTypeAny>): string[] {
  return Object.keys(shape).filter((k) => shape[k].safeParse(undefined).success);
}

export function minContentOf(
  def: Record<string, unknown>,
  shape: Record<string, z.ZodTypeAny>
): Record<string, unknown> {
  const optional = new Set(optionalKeysOf(shape));
  return Object.fromEntries(Object.entries(def).filter(([k]) => !optional.has(k)));
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function withoutKey(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}

export function hasStringProps(obj: Record<string, unknown>, ...keys: string[]): boolean {
  return keys.every((k) => typeof obj[k] === "string");
}
