# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-05-31

Fourth and final landing in the v-suite upstream richness flow. Consumes
vTheme 0.3.0 (font + tone + tracking tokens), vDsl 0.3.0 (typeface / tone /
tracking / semanticKind props + 218-entry safelist), and vUi 0.4.0 (Kicker,
Eyebrow, Lead, Pill primitives plus Button/Card/Badge tone retune).

### Added

- `kicker?: string` and `eyebrow?: string` optional content fields on every
  section schema (Hero, Cta, Faq, Footer, Blog, Business, Gallery, Portfolio,
  Post, Team, Testimonial, Features split + grid variants). Kicker renders
  through `<Kicker>`; eyebrow renders through `<Eyebrow tone="info">`.
- `tonePills?: Array<{ label: string; tone?: 'ok'|'warn'|'bad'|'info'|'meta' }>`
  optional field on every section. Each entry renders through
  `<Pill tone={...}>` from vUi 0.4.0 (engagement-tag chrome, tone-soft fill).
- `density?: 'compact' | 'normal' | 'spacious'` optional field on every
  section. Maps to vDsl `py` prop on the section root: compact = py-12,
  normal = py-24 (default), spacious = py-32.
- Shared `DensitySchema`, `ToneSchema`, `TonePillSchema` in
  `src/shared/schemas.ts` as single source of truth for the new fields.
- Shared `densityPy(density)` and `Density` / `TonePill` types in
  `src/theme.ts` for consistent py-resolution across every section.
- `tests/richness.test.tsx`: per-block schema + render contract for the four
  new fields (296 added assertions; covers tone enum, density enum, semantic
  data attributes, kicker/eyebrow DOM presence, pill count per section).
- Tone-utility safelist in `tailwind.config.js` so the precompiled
  `dist/styles.css` carries `bg-tone-*-soft`, `text-tone-*-fg`, and
  `border-tone-*-fg/{25,40}` for every tone (15 added utilities).

### Changed

- Section headings switched from `text-3xl font-bold tracking-tight` /
  `text-5xl font-bold tracking-tight leading-tight` to proposal-grade
  serif sizing: hero `h1` is `font-serif font-medium tracking-tight
  text-[clamp(2.3rem,4.2vw,3.2rem)]`; section `h2` is
  `text-[clamp(1.65rem,2.8vw,2.15rem)]`; post `h1` is
  `text-[clamp(2rem,3.6vw,2.6rem)]`. Card titles (h3) switched to
  `font-serif font-medium`.
- Section description / lead paragraphs now render through `<Lead>` from
  vUi 0.4.0 (constrained measure, muted-foreground color, leading-relaxed)
  instead of a local `DBox as="p" color="muted" className="text-lg"` pattern.
- Default vertical padding raised from `py-16` (content blocks),
  `py-20` (CtaCentered), `py-12` (footers) to a unified `py-24` (normal
  density) on every section. Consumers can opt back with `density="compact"`.
- HeroSplit hero already defaulted to `py-24`; HeroSplit now flows that
  through the density mechanism instead of a hard-coded literal.
- FeaturesGrid + FaqGrid + BusinessGrid + TestimonialGrid + TeamGrid heading
  rows gained eyebrow/kicker scaffolding above the section heading; tone-pill
  rendering sits between heading and content body when populated.
- FooterSplit brand-name run rendered in `font-serif font-medium` to match
  the proposal brand-mark treatment.
- Default content rewrites for Hero, Cta, Features, Business sections:
  terse noun-phrase voice, kicker + eyebrow + lead structure, no marketing
  hedges, no em-dashes (proposal voice match).
- `@booga/vtheme` raised to `^0.3.0`. `@booga/vdsl` raised to `^0.3.0`.
  `@booga/vui` raised to `^0.4.0`. Stylesheet rebuild includes vUi 0.4.0
  utility classes via `node_modules/@booga/vui/dist` content glob.

### Breaking

- Section vertical padding default doubles from `py-12` / `py-16` to
  `py-24`. Pages stacking multiple sections grow vertically. Opt-out:
  pass `density="compact"` on the affected sections.
- Section headings switch typeface from sans-serif bold to serif medium
  (Playfair Display via vTheme 0.3.0's `--v-font-serif` token, fallback
  `Georgia, serif`). Visual change is large. No API change; existing
  schemas continue to validate.
- Lead-paragraph rendering moved into `<Lead>` from vUi 0.4.0. Output
  carries `data-semantic-kind="lead"` + `vkind-lead` className. Consumers
  asserting on the previous flat `<p class="text-lg">` output need to
  update their selectors.

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
