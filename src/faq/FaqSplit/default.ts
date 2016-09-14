import { type FaqSplitContent } from "./schema";

export const FaqSplitDefaultContent: FaqSplitContent = {
  heading: "Frequently asked questions",
  description: "Everything you need to know about the product.",
  items: [
    { question: "How does it work?", answer: "Drop a block onto your page, pass typed content, and render. No manual wiring." },
    { question: "Can I customise the styles?", answer: "Yes. Pass a ThemeOverride to any block to remap CSS custom properties." },
    { question: "Does it require a specific framework?", answer: "React 18+ and Tailwind CSS. No other runtime dependencies." },
  ],
};
