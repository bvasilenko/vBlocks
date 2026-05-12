// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type TestimonialGridContent } from "./schema";

export const TestimonialGridDefaultContent: TestimonialGridContent = {
  heading: "What teams are saying",
  items: [
    { quote: "Schema validation alone saved us from three production bugs in the first week.", author: "Jordan Ellis", role: "Product Lead", company: "Acme" },
    { quote: "The composable approach means we can swap blocks without touching the rest of the page.", author: "Sam Rivera", role: "Engineering Lead" },
    { quote: "Typed content props make onboarding new designers trivially easy.", author: "Taylor Kim", role: "Design Lead", company: "Studio N" },
  ],
};
