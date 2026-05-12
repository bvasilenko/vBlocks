// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type AnyBlockMeta } from "./types";

import { HeroSplit } from "./hero/HeroSplit/index";
import { HeroSplitContentSchema } from "./hero/HeroSplit/schema";
import { HeroSplitDefaultContent } from "./hero/HeroSplit/default";

import { HeroCentered } from "./hero/HeroCentered/index";
import { HeroCenteredContentSchema } from "./hero/HeroCentered/schema";
import { HeroCenteredDefaultContent } from "./hero/HeroCentered/default";

import { CtaSplit } from "./cta/CtaSplit/index";
import { CtaSplitContentSchema } from "./cta/CtaSplit/schema";
import { CtaSplitDefaultContent } from "./cta/CtaSplit/default";

import { CtaCentered } from "./cta/CtaCentered/index";
import { CtaCenteredContentSchema } from "./cta/CtaCentered/schema";
import { CtaCenteredDefaultContent } from "./cta/CtaCentered/default";

import { FaqSplit } from "./faq/FaqSplit/index";
import { FaqSplitContentSchema } from "./faq/FaqSplit/schema";
import { FaqSplitDefaultContent } from "./faq/FaqSplit/default";

import { FaqGrid } from "./faq/FaqGrid/index";
import { FaqGridContentSchema } from "./faq/FaqGrid/schema";
import { FaqGridDefaultContent } from "./faq/FaqGrid/default";

import { FooterSplit } from "./footer/FooterSplit/index";
import { FooterSplitContentSchema } from "./footer/FooterSplit/schema";
import { FooterSplitDefaultContent } from "./footer/FooterSplit/default";

import { FooterGrid } from "./footer/FooterGrid/index";
import { FooterGridContentSchema } from "./footer/FooterGrid/schema";
import { FooterGridDefaultContent } from "./footer/FooterGrid/default";

import { GallerySplit } from "./gallery/GallerySplit/index";
import { GallerySplitContentSchema } from "./gallery/GallerySplit/schema";
import { GallerySplitDefaultContent } from "./gallery/GallerySplit/default";

import { GalleryGrid } from "./gallery/GalleryGrid/index";
import { GalleryGridContentSchema } from "./gallery/GalleryGrid/schema";
import { GalleryGridDefaultContent } from "./gallery/GalleryGrid/default";

import { PortfolioSplit } from "./portfolio/PortfolioSplit/index";
import { PortfolioSplitContentSchema } from "./portfolio/PortfolioSplit/schema";
import { PortfolioSplitDefaultContent } from "./portfolio/PortfolioSplit/default";

import { PortfolioGrid } from "./portfolio/PortfolioGrid/index";
import { PortfolioGridContentSchema } from "./portfolio/PortfolioGrid/schema";
import { PortfolioGridDefaultContent } from "./portfolio/PortfolioGrid/default";

import { PostSplit } from "./post/PostSplit/index";
import { PostSplitContentSchema } from "./post/PostSplit/schema";
import { PostSplitDefaultContent } from "./post/PostSplit/default";

import { PostCentered } from "./post/PostCentered/index";
import { PostCenteredContentSchema } from "./post/PostCentered/schema";
import { PostCenteredDefaultContent } from "./post/PostCentered/default";

import { TeamSplit } from "./team/TeamSplit/index";
import { TeamSplitContentSchema } from "./team/TeamSplit/schema";
import { TeamSplitDefaultContent } from "./team/TeamSplit/default";

import { TeamGrid } from "./team/TeamGrid/index";
import { TeamGridContentSchema } from "./team/TeamGrid/schema";
import { TeamGridDefaultContent } from "./team/TeamGrid/default";

import { TestimonialSplit } from "./testimonial/TestimonialSplit/index";
import { TestimonialSplitContentSchema } from "./testimonial/TestimonialSplit/schema";
import { TestimonialSplitDefaultContent } from "./testimonial/TestimonialSplit/default";

import { TestimonialGrid } from "./testimonial/TestimonialGrid/index";
import { TestimonialGridContentSchema } from "./testimonial/TestimonialGrid/schema";
import { TestimonialGridDefaultContent } from "./testimonial/TestimonialGrid/default";

import { BlogSplit } from "./blog/BlogSplit/index";
import { BlogSplitContentSchema } from "./blog/BlogSplit/schema";
import { BlogSplitDefaultContent } from "./blog/BlogSplit/default";

import { BlogGrid } from "./blog/BlogGrid/index";
import { BlogGridContentSchema } from "./blog/BlogGrid/schema";
import { BlogGridDefaultContent } from "./blog/BlogGrid/default";

import { BusinessSplit } from "./business/BusinessSplit/index";
import { BusinessSplitContentSchema } from "./business/BusinessSplit/schema";
import { BusinessSplitDefaultContent } from "./business/BusinessSplit/default";

import { BusinessGrid } from "./business/BusinessGrid/index";
import { BusinessGridContentSchema } from "./business/BusinessGrid/schema";
import { BusinessGridDefaultContent } from "./business/BusinessGrid/default";

import { FeaturesSplit } from "./features/FeaturesSplit/index";
import { FeaturesSplitContentSchema } from "./features/FeaturesSplit/schema";
import { FeaturesSplitDefaultContent } from "./features/FeaturesSplit/default";

import { FeaturesGrid } from "./features/FeaturesGrid/index";
import { FeaturesGridContentSchema } from "./features/FeaturesGrid/schema";
import { FeaturesGridDefaultContent } from "./features/FeaturesGrid/default";

export type BlockId =
  | "hero/split" | "hero/centered"
  | "cta/split" | "cta/centered"
  | "faq/split" | "faq/grid"
  | "footer/split" | "footer/grid"
  | "gallery/split" | "gallery/grid"
  | "portfolio/split" | "portfolio/grid"
  | "post/split" | "post/centered"
  | "team/split" | "team/grid"
  | "testimonial/split" | "testimonial/grid"
  | "blog/split" | "blog/grid"
  | "business/split" | "business/grid"
  | "features/split" | "features/grid";

export const registry: Record<BlockId, AnyBlockMeta> = {
  "hero/split":          { schema: HeroSplitContentSchema,          default: HeroSplitDefaultContent,          component: HeroSplit },
  "hero/centered":       { schema: HeroCenteredContentSchema,       default: HeroCenteredDefaultContent,       component: HeroCentered },
  "cta/split":           { schema: CtaSplitContentSchema,           default: CtaSplitDefaultContent,           component: CtaSplit },
  "cta/centered":        { schema: CtaCenteredContentSchema,        default: CtaCenteredDefaultContent,        component: CtaCentered },
  "faq/split":           { schema: FaqSplitContentSchema,           default: FaqSplitDefaultContent,           component: FaqSplit },
  "faq/grid":            { schema: FaqGridContentSchema,            default: FaqGridDefaultContent,            component: FaqGrid },
  "footer/split":        { schema: FooterSplitContentSchema,        default: FooterSplitDefaultContent,        component: FooterSplit },
  "footer/grid":         { schema: FooterGridContentSchema,         default: FooterGridDefaultContent,         component: FooterGrid },
  "gallery/split":       { schema: GallerySplitContentSchema,       default: GallerySplitDefaultContent,       component: GallerySplit },
  "gallery/grid":        { schema: GalleryGridContentSchema,        default: GalleryGridDefaultContent,        component: GalleryGrid },
  "portfolio/split":     { schema: PortfolioSplitContentSchema,     default: PortfolioSplitDefaultContent,     component: PortfolioSplit },
  "portfolio/grid":      { schema: PortfolioGridContentSchema,      default: PortfolioGridDefaultContent,      component: PortfolioGrid },
  "post/split":          { schema: PostSplitContentSchema,          default: PostSplitDefaultContent,          component: PostSplit },
  "post/centered":       { schema: PostCenteredContentSchema,       default: PostCenteredDefaultContent,       component: PostCentered },
  "team/split":          { schema: TeamSplitContentSchema,          default: TeamSplitDefaultContent,          component: TeamSplit },
  "team/grid":           { schema: TeamGridContentSchema,           default: TeamGridDefaultContent,           component: TeamGrid },
  "testimonial/split":   { schema: TestimonialSplitContentSchema,   default: TestimonialSplitDefaultContent,   component: TestimonialSplit },
  "testimonial/grid":    { schema: TestimonialGridContentSchema,    default: TestimonialGridDefaultContent,    component: TestimonialGrid },
  "blog/split":          { schema: BlogSplitContentSchema,          default: BlogSplitDefaultContent,          component: BlogSplit },
  "blog/grid":           { schema: BlogGridContentSchema,           default: BlogGridDefaultContent,           component: BlogGrid },
  "business/split":      { schema: BusinessSplitContentSchema,      default: BusinessSplitDefaultContent,      component: BusinessSplit },
  "business/grid":       { schema: BusinessGridContentSchema,       default: BusinessGridDefaultContent,       component: BusinessGrid },
  "features/split":      { schema: FeaturesSplitContentSchema,      default: FeaturesSplitDefaultContent,      component: FeaturesSplit },
  "features/grid":       { schema: FeaturesGridContentSchema,       default: FeaturesGridDefaultContent,       component: FeaturesGrid },
};
