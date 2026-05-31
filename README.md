# vBlocks

Composed section blocks: hero, CTA, FAQ, footer, gallery, portfolio, post, team, testimonial, blog, business, features. Schema-validated content, vUi primitives, DSL-styled. Drop into a page - no manual wiring.

## Install

```sh
npm install @booga/vblocks
```

## Usage

```tsx
import { HeroSplit, HeroSplitDefaultContent } from "@booga/vblocks/hero";

<HeroSplit content={HeroSplitDefaultContent} />
```

Or with typed content:

```tsx
import { HeroSplit, type HeroSplitContent } from "@booga/vblocks/hero";

const content: HeroSplitContent = {
  heading: "Ship faster.",
  description: "Composable blocks with schema-validated content.",
  primaryCta: { label: "Get started", href: "/start" },
  image: { src: "/hero.png", alt: "Product screenshot" },
};

<HeroSplit content={content} />
```

## Blocks

| Category | Variants |
|---|---|
| `hero` | `HeroSplit`, `HeroCentered` |
| `cta` | `CtaSplit`, `CtaCentered` |
| `faq` | `FaqSplit`, `FaqGrid` |
| `footer` | `FooterSplit`, `FooterGrid` |
| `gallery` | `GallerySplit`, `GalleryGrid` |
| `portfolio` | `PortfolioSplit`, `PortfolioGrid` |
| `post` | `PostSplit`, `PostCentered` |
| `team` | `TeamSplit`, `TeamGrid` |
| `testimonial` | `TestimonialSplit`, `TestimonialGrid` |
| `blog` | `BlogSplit`, `BlogGrid` |
| `business` | `BusinessSplit`, `BusinessGrid` |
| `features` | `FeaturesSplit`, `FeaturesGrid` |

Each block exports:

- `<Variant>` - component
- `<Variant>ContentSchema` - Zod schema
- `<Variant>Content` - TypeScript type
- `<Variant>DefaultContent` - sample content for previews

## Richness vocabulary (0.4.0)

Every section schema accepts four optional richness-flow fields driven by
vUi 0.4.0 primitives and vTheme 0.3.0 tone tokens:

| Field | Type | Renders via |
|---|---|---|
| `kicker?` | `string` | `<Kicker>` (rounded-full chip, semantic-kind `kicker`) |
| `eyebrow?` | `string` | `<Eyebrow tone="info">` (uppercase tracking-wide label) |
| `tonePills?` | `Array<{ label, tone? }>` | `<Pill tone={...}>` (engagement-tag chrome) |
| `density?` | `'compact' \| 'normal' \| 'spacious'` | section `py` (12 / 24 / 32; default `normal`) |

Section headings render in `font-serif` with `clamp(...)` sizing aligned to
the proposal typography. Description prose renders through `<Lead>` from vUi
(constrained measure, muted-foreground color, relaxed line-height).

## Theme overrides

Pass a `ThemeOverride` to remap CSS custom properties per block:

```tsx
<HeroSplit content={content} theme={{ "color-accent": "#6366f1" }} />
```

Keys are mapped to `--v-<key>` on the block's root element.

## Registry

A flat registry for `vRegistry` consumption:

```ts
import { registry } from "@booga/vblocks";
// registry["hero/split"] → { schema, default, component }
```

## Code of conduct

[Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

## License

MIT © 2026 bvasilenko
