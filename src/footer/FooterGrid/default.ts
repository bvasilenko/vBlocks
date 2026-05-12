// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type FooterGridContent } from "./schema";

export const FooterGridDefaultContent: FooterGridContent = {
  columns: [
    { heading: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
    { heading: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }] },
    { heading: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
  ],
  copyright: "© 2026 Acme. All rights reserved.",
};
