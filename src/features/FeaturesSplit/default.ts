import { type FeaturesSplitContent } from "./schema";

export const FeaturesSplitDefaultContent: FeaturesSplitContent = {
  heading: "Everything you need",
  description: "A complete toolkit for building composable, schema-validated interfaces.",
  features: [
    { title: "Schema validation", description: "Every block validates content at runtime. Bad data fails fast, before it reaches the DOM.", icon: "✓" },
    { title: "Tree-shaking", description: "Per-category entry points keep bundles lean. Import only what the page uses.", icon: "⚡" },
    { title: "Accessibility first", description: "Semantic HTML, ARIA landmarks, and proper heading hierarchy — no patching required.", icon: "♿" },
    { title: "Theme overrides", description: "Remap CSS custom properties per block without touching global styles.", icon: "🎨" },
  ],
};
