// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type GallerySplitContent } from "./schema";

export const GallerySplitDefaultContent: GallerySplitContent = {
  heading: "Our work",
  description: "A selection of recent projects.",
  items: [
    { src: "https://placehold.co/400x300", alt: "Project one" },
    { src: "https://placehold.co/400x300", alt: "Project two" },
    { src: "https://placehold.co/400x300", alt: "Project three", caption: "Featured project" },
  ],
};
