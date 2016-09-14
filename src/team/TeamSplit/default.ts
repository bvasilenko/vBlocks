import { type TeamSplitContent } from "./schema";

export const TeamSplitDefaultContent: TeamSplitContent = {
  heading: "Meet the team",
  description: "The people behind the product.",
  members: [
    { name: "Jordan Ellis", role: "Product Lead", avatar: { src: "https://placehold.co/80x80", alt: "Jordan Ellis" }, bio: "Focused on user experience and product strategy." },
    { name: "Sam Rivera", role: "Engineering Lead", avatar: { src: "https://placehold.co/80x80", alt: "Sam Rivera" }, bio: "Architecting scalable systems since 2015." },
    { name: "Taylor Kim", role: "Design Lead", avatar: { src: "https://placehold.co/80x80", alt: "Taylor Kim" } },
  ],
};
