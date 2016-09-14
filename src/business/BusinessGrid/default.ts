import { type BusinessGridContent } from "./schema";

export const BusinessGridDefaultContent: BusinessGridContent = {
  heading: "What we do",
  services: [
    { title: "Product strategy", description: "From market positioning to roadmap — we help teams move with clarity.", icon: "🗺️" },
    { title: "UX design", description: "Research-grounded design that reduces cognitive load and increases confidence.", icon: "✏️" },
    { title: "Engineering", description: "Full-stack delivery with a bias toward composable, testable architecture.", icon: "⚙️" },
    { title: "Design systems", description: "A single source of truth for tokens, components, and documentation.", icon: "🎨" },
  ],
};
