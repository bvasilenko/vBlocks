# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.5] - 2026-05-24

### Fixed

- Comprehensive responsive pass. 0.3.4 fixed the 6 named Grid blocks; a full
  mobile probe at 320/360/390/768 px caught residual overflow in 8 other blocks
  (BlogSplit at 390; PortfolioSplit, FeaturesSplit at 360; HeroSplit,
  PortfolioGrid, TeamSplit, FeaturesSplit at 320). Every layout grid in every
  block now collapses on mobile: the 11 Split blocks (TeamSplit, TestimonialSplit,
  HeroSplit, GallerySplit, PortfolioSplit, CtaSplit, FeaturesSplit, FooterSplit,
  PostSplit, FaqSplit, BusinessSplit) outer 2-column grid → `grid-cols-1
  lg:grid-cols-2`; GalleryGrid 3-column grid → `grid-cols-1 sm:grid-cols-2
  lg:grid-cols-3`; PortfolioGrid 2-column grid → `grid-cols-1 sm:grid-cols-2`;
  BlogSplit outer featured/list grid → `grid-cols-1 lg:grid-cols-2`. Desktop
  layout unchanged. Verified at 320/360/390/768 — zero overflow across all
  24 blocks at 390/360/768 and a 2 px residual at 320 in hero-split (below
  perceivable threshold; no element-level culprit).

## [0.3.4] - 2026-05-19

### Fixed

- The six Grid blocks (TeamGrid, FaqGrid, TestimonialGrid, BlogGrid, BusinessGrid,
  FeaturesGrid) used a fixed column count — `grid-cols-3` / `grid-cols-2` — with
  no responsive breakpoints. On a 390px phone the columns collapsed to ~98px:
  card titles wrapped one word per line and clipped past the card edge, and
  BlogGrid/FeaturesGrid overflowed the viewport horizontally. The grids now
  collapse responsively — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for the
  3-column blocks, `grid-cols-1 sm:grid-cols-2` for the 2-column blocks
  (FaqGrid, BusinessGrid). Desktop layout is unchanged.

## [0.3.3] - 2026-05-18

### Fixed

- Precompiled `dist/styles.css` omitted most of the spacing scale (`gap-6`,
  `px-6`, `py-16`, …) and every color-role utility. `dsl()` builds those class
  names at runtime via template literals, which Tailwind's content scanner
  cannot see, so the precompiled build dropped them — blocks rendered with
  collapsed gaps and padding, and all `color="muted"` text fell back to black
  instead of muted grey. `tailwind.config.js` now safelists `@booga/vdsl`'s
  `dslSafelist`; the styled-render gate asserts full coverage so it cannot
  regress. Requires `@booga/vdsl ^0.2.0`, whose color tokens also now resolve
  through vTheme's role contract (`text-muted-foreground`, `bg-accent`, …)
  instead of invalid raw-channel `var()` references.
- BlogSplit default content: the first secondary post lacked a `category`, so
  its card rendered without the badge its sibling cards had.
- TestimonialSplit attribution rendered "Jordan Ellis , Product Lead at Acme"
  with a stray space before the comma — the comma was a separately gapped span.
  Attribution is now a single run: "Jordan Ellis, Product Lead at Acme".

### Changed

- Unified the type hierarchy across all blocks. Section headings were a mix of
  `text-3xl` and `text-4xl`; they are now uniformly `text-3xl` (`text-4xl` for
  the PostSplit article `<h1>`, `text-5xl` for hero `<h1>`). Card/feature `<h3>`
  titles that carried no size class — and so rendered at body size — are now
  `text-lg`, giving every block a consistent heading→subhead→body progression.
- HeroCentered description lowered from `text-xl` to `text-lg`. In vTheme's type
  scale `text-xl` carries `font-weight: 600`, so the lead paragraph rendered as
  a bold line competing with the heading; `text-lg` (weight 500) reads as a
  proper subordinate lead.
- Unified section vertical rhythm: content blocks pad `py-16`, hero blocks
  `py-24`, footers `py-12`. GalleryGrid and PortfolioGrid (`py-12`) and HeroSplit
  (`py-16`) previously broke the scheme.
- TeamGrid member cards: avatar/name/role were jammed to the card top with dead
  space below (`pt-4` + `gap-3`); now balanced (`py-6` + `gap-4`).

## [0.3.2] - 2026-05-18

### Fixed

- Category `<Badge>` in BlogGrid, BlogSplit, PortfolioGrid, PortfolioSplit, PostCentered, and PostSplit stretched to a full-width bar: each sat in a flex-column `DStack` whose default `align-items: stretch` widened it. Badges now carry `self-start`, rendering as content-width chips.
- BlogGrid default content: the middle post lacked a `category`, so its card rendered without the badge the sibling cards had. All default posts now carry a category for a consistent three-card grid.

## [0.3.1] - 2026-05-18

### Fixed

- Grid/Split block section containers used inconsistent max-widths (`max-w-5xl` on 6 blocks, `max-w-6xl` on the rest), so a page stacking different blocks showed misaligned content columns. All full-width Grid/Split blocks now share `max-w-6xl`. (Centered/Post blocks keep their intentionally narrower measure.)

## [0.3.0] - 2026-05-18

### Added

- Precompiled stylesheet at `@booga/vblocks/styles.css` — zero-config adoption. A consumer with no Tailwind pipeline imports this one file and the blocks render styled; no preset, no content globs, no Tailwind build. It covers the blocks' own classes and the vUi classes they render through. Consumers running their own Tailwind should keep using `@booga/vtheme/preset`.

### Changed

- `@booga/vui` dependency raised to `^0.3.0`.

## [0.2.0] - 2026-05-18

### Changed

- `@booga/vui` dependency raised to `^0.2.0`. vUi 0.2.0 resolves its color classes through `@booga/vtheme`'s semantic role contract, so blocks render correctly once the consumer applies vTheme's Tailwind preset (`presets: [require("@booga/vtheme/preset")]`).

## [0.1.0] - 2026-05-12

### Added

- 24 blocks across 12 categories: hero, CTA, FAQ, footer, gallery, portfolio, post, team, testimonial, blog, business, features
- Per-block Zod content schemas with strict validation and exported TypeScript types
- Per-block default content using neutral placeholder copy
- Flat registry (`src/registry.ts`) mapping block IDs to `{ schema, default, component }`
- Per-category tree-shakable entry points (`@booga/vblocks/hero`, etc.)
- `ThemeOverride` prop wired to CSS custom properties per block
- Full accessibility: semantic HTML, ARIA landmarks, proper heading hierarchy
