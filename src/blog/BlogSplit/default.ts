// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type BlogSplitContent } from "./schema";

export const BlogSplitDefaultContent: BlogSplitContent = {
  heading: "Latest posts",
  posts: [
    { title: "Designing for composability", excerpt: "How modular thinking unlocks maintainable systems at scale.", date: "2026-05-01", category: "Design", image: { src: "https://placehold.co/600x400", alt: "Design systems post" } },
    { title: "Type-safe content at runtime", excerpt: "Zod schemas as the single source of truth for block content.", date: "2026-04-18", image: { src: "https://placehold.co/400x280", alt: "Type safety post" } },
    { title: "Tree-shaking section blocks", excerpt: "Per-category entry points and how they keep bundles lean.", date: "2026-04-05", category: "Engineering", image: { src: "https://placehold.co/400x280", alt: "Tree-shaking post" } },
  ],
};
