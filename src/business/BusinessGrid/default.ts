// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type BusinessGridContent } from "./schema";

export const BusinessGridDefaultContent: BusinessGridContent = {
  kicker: "Services",
  eyebrow: "What we do",
  heading: "What we do.",
  services: [
    { title: "Product strategy", description: "Market positioning to roadmap. Teams move with clarity.", icon: "🗺️" },
    { title: "UX design", description: "Research-grounded design. Less cognitive load, more confidence.", icon: "✏️" },
    { title: "Engineering", description: "Full-stack delivery. Composable, testable architecture.", icon: "⚙️" },
    { title: "Design systems", description: "Single source of truth for tokens, components, and documentation.", icon: "🎨" },
  ],
};
