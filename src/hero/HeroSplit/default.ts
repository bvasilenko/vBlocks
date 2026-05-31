// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type HeroSplitContent } from "./schema";

export const HeroSplitDefaultContent: HeroSplitContent = {
  kicker: "Platform",
  eyebrow: "Composable section blocks",
  heading: "Ship a real branded surface, not a token swap.",
  description: "Schema-validated content. Typed primitives. Proposal-grade typography and tone semantics out of the box.",
  primaryCta: { label: "Get started", href: "#" },
  secondaryCta: { label: "Read the brief", href: "#" },
  tonePills: [
    { label: "Typed content", tone: "info" },
    { label: "A11y first", tone: "ok" },
  ],
  image: { src: "https://placehold.co/600x400", alt: "Product preview" },
};
