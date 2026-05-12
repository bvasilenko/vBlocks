// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type TeamGridContent } from "./schema";

export const TeamGridDefaultContent: TeamGridContent = {
  heading: "Our team",
  members: [
    { name: "Jordan Ellis", role: "Product Lead", avatar: { src: "https://placehold.co/80x80", alt: "Jordan Ellis" } },
    { name: "Sam Rivera", role: "Engineering Lead", avatar: { src: "https://placehold.co/80x80", alt: "Sam Rivera" } },
    { name: "Taylor Kim", role: "Design Lead", avatar: { src: "https://placehold.co/80x80", alt: "Taylor Kim" } },
    { name: "Morgan Blake", role: "Research Lead", avatar: { src: "https://placehold.co/80x80", alt: "Morgan Blake" } },
  ],
};
