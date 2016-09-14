import { type FaqGridContent } from "./schema";

export const FaqGridDefaultContent: FaqGridContent = {
  heading: "Common questions",
  items: [
    { question: "How does it work?", answer: "Drop a block onto your page, pass typed content, and render." },
    { question: "Can I customise styles?", answer: "Yes. ThemeOverride maps to CSS custom properties." },
    { question: "Which frameworks are supported?", answer: "React 18+ with Tailwind CSS." },
    { question: "Is TypeScript required?", answer: "Strongly recommended. All content schemas export their types." },
  ],
};
