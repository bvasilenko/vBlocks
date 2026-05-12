// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type FooterSplitContent } from "./schema";

export const FooterSplitDefaultContent: FooterSplitContent = {
  brand: { name: "Acme", tagline: "Build things that matter." },
  links: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ],
  copyright: "© 2026 Acme. All rights reserved.",
};
