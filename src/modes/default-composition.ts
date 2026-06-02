// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { CompositionSpec } from "@booga/vbrand/composition";
import type { BlockId } from "../registry";

const CATALOG_ORDER: readonly BlockId[] = [
  "hero/split",        "hero/centered",
  "cta/split",         "cta/centered",
  "features/split",    "features/grid",
  "footer/split",      "footer/grid",
  "blog/split",        "blog/grid",
  "business/split",    "business/grid",
  "gallery/split",     "gallery/grid",
  "portfolio/split",   "portfolio/grid",
  "faq/split",         "faq/grid",
  "post/split",        "post/centered",
  "team/split",        "team/grid",
  "testimonial/split", "testimonial/grid",
];

export function defaultCatalogComposition(): CompositionSpec {
  return {
    sections: CATALOG_ORDER.map((id, order) => ({
      id,
      visible: true,
      density: "regular" as const,
      order,
    })),
  };
}
