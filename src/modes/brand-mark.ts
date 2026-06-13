// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { VbrandType } from "@booga/vbrand";

export type BrandMarkImage = {
  src: string;
  alt: string;
  fallbackSrc: string;
};

type Candidate = {
  source: string;
  label: string;
  rank: number;
  dimensions?: readonly [number, number];
};

const LOW_FIDELITY_SOURCE = /\b(favicon|apple-touch-icon|mstile|shortcut-icon)\b|\.(ico|cur)$/i;
const VECTOR_SOURCE = /\.(svg)(?:[?#].*)?$/i;
const HIGH_FIDELITY_RASTER_SOURCE = /\.(png|webp|avif|jpg|jpeg)(?:[?#].*)?$/i;
const MARK_HINT = /\b(logo|mark|wordmark|brand)\b/i;

export function selectBrandMarkImage(brand: VbrandType): BrandMarkImage {
  return {
    src: selectBestCandidate(brand).source,
    alt: `${brand.name} logo`,
    fallbackSrc: createBrandWordmarkDataUri(brand),
  };
}

function selectBestCandidate(brand: VbrandType): Candidate {
  return candidatesFor(brand).sort(compareCandidates)[0];
}

function candidatesFor(brand: VbrandType): Candidate[] {
  return [
    ...markVariantCandidates(brand),
    ...iconSetCandidates(brand),
    ...ogImageCandidate(brand),
    faviconCandidate(brand),
  ];
}

function markVariantCandidates(brand: VbrandType): Candidate[] {
  return (brand.marks?.variants ?? []).map((variant, index) => ({
    source: variant.source,
    label: [variant.name, variant.usage].filter(Boolean).join(" "),
    rank: 400 - index,
  }));
}

function iconSetCandidates(brand: VbrandType): Candidate[] {
  return brand.assets.icons.set.map((source, index) => ({
    source,
    label: source,
    rank: 250 - index,
  }));
}

function ogImageCandidate(brand: VbrandType): Candidate[] {
  const source = brand.assets.og.source;
  return source ? [{ source, label: source, rank: 220, dimensions: brand.assets.og.dimensions }] : [];
}

function faviconCandidate(brand: VbrandType): Candidate {
  return {
    source: brand.assets.favicon.source,
    label: brand.assets.favicon.source,
    rank: 0,
  };
}

function compareCandidates(a: Candidate, b: Candidate): number {
  return scoreCandidate(b) - scoreCandidate(a);
}

function scoreCandidate(candidate: Candidate): number {
  return candidate.rank
    + sourceQualityScore(candidate.source)
    + labelQualityScore(candidate.label)
    + dimensionQualityScore(candidate.dimensions);
}

function sourceQualityScore(source: string): number {
  if (LOW_FIDELITY_SOURCE.test(source)) return -300;
  if (VECTOR_SOURCE.test(source)) return 200;
  if (HIGH_FIDELITY_RASTER_SOURCE.test(source)) return 100;
  return 0;
}

function labelQualityScore(label: string): number {
  return MARK_HINT.test(label) ? 50 : 0;
}

function dimensionQualityScore(dimensions: readonly [number, number] | undefined): number {
  if (!dimensions) return 0;
  const [width, height] = dimensions;
  if (width >= 1000 && height >= 500) return 120;
  if (width >= 512 && height >= 256) return 80;
  if (width >= 256 && height >= 128) return 40;
  return 0;
}

function createBrandWordmarkDataUri(brand: VbrandType): string {
  const label = brand.name.trim() || "Brand";
  const primary = colorToken(brand, "primary", "#111827");
  const secondary = colorToken(brand, "secondary", "#ffffff");
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" viewBox="0 0 640 320" role="img">',
    `<rect width="640" height="320" rx="48" fill="${escapeXml(primary)}"/>`,
    `<text x="320" y="176" text-anchor="middle" dominant-baseline="middle" fill="${escapeXml(secondary)}" font-family="Inter, system-ui, sans-serif" font-size="72" font-weight="700">${escapeXml(label)}</text>`,
    "</svg>",
  ].join("");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function colorToken(brand: VbrandType, token: string, fallback: string): string {
  const value = brand.tokens.color[token];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
