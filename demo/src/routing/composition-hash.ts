// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { compositionToHash, type CompositionSpec } from "@booga/vbrand/composition";
import type { RouteMode } from "./route";

const HASH_PREFIX = "#";
const MODE_KEY = "mode";
const ROUTE_MODES = new Set<RouteMode>(["catalog", "canvas", "app-template"]);

function hashBody(hash: string): string {
  return hash.startsWith(HASH_PREFIX) ? hash.slice(1) : hash;
}

function compositionPair(spec: CompositionSpec): string {
  return hashBody(compositionToHash(spec));
}

function currentRouteMode(hash: string): RouteMode | null {
  const value = new URLSearchParams(hashBody(hash)).get(MODE_KEY);
  return value !== null && ROUTE_MODES.has(value as RouteMode) ? (value as RouteMode) : null;
}

export function compositionHashFor(spec: CompositionSpec, currentHash: string): string {
  const pairs = [compositionPair(spec)];
  const mode = currentRouteMode(currentHash);
  if (mode) pairs.unshift(`${MODE_KEY}=${mode}`);
  return `${HASH_PREFIX}${pairs.join("&")}`;
}

export function writeCompositionHash(spec: CompositionSpec): void {
  window.location.hash = compositionHashFor(spec, window.location.hash);
}
