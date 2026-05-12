// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type FeaturesGridContent } from "./schema";

export const FeaturesGridDefaultContent: FeaturesGridContent = {
  heading: "Built-in capabilities",
  features: [
    { title: "Schema validation", description: "Content validated at runtime via Zod.", icon: "✓" },
    { title: "Tree-shaking", description: "Per-category entry points, lean bundles.", icon: "⚡" },
    { title: "Accessibility", description: "Semantic HTML and ARIA by default.", icon: "♿" },
    { title: "Theme overrides", description: "CSS custom properties per block.", icon: "🎨" },
    { title: "TypeScript", description: "All schemas export their inferred types.", icon: "🔷" },
    { title: "Zero config", description: "Drop in. Pass content. Done.", icon: "▶️" },
  ],
};
