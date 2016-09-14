import { type BlogGridContent } from "./schema";

export const BlogGridDefaultContent: BlogGridContent = {
  heading: "From the blog",
  posts: [
    { title: "Designing for composability", excerpt: "Modular thinking at scale.", date: "2026-05-01", category: "Design", image: { src: "https://placehold.co/480x320", alt: "Design post" } },
    { title: "Type-safe content at runtime", excerpt: "Zod as single source of truth.", date: "2026-04-18", image: { src: "https://placehold.co/480x320", alt: "Types post" } },
    { title: "Tree-shaking section blocks", excerpt: "Lean bundles, per-category entry points.", date: "2026-04-05", category: "Engineering", image: { src: "https://placehold.co/480x320", alt: "Bundling post" } },
  ],
};
