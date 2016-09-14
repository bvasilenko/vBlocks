import { type PortfolioSplitContent } from "./schema";

export const PortfolioSplitDefaultContent: PortfolioSplitContent = {
  heading: "Selected work",
  description: "Projects spanning product design, engineering, and research.",
  items: [
    { title: "Commerce platform redesign", category: "Product", image: { src: "https://placehold.co/480x360", alt: "Commerce project" } },
    { title: "Data visualisation system", category: "Engineering", image: { src: "https://placehold.co/480x360", alt: "Data project" } },
    { title: "Design language rollout", category: "Design", image: { src: "https://placehold.co/480x360", alt: "Design project" } },
  ],
};
