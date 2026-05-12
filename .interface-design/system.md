# Design System

## Color Palette
Tokens are CSS custom properties applied via `themeStyle(theme)` on each block root element.
Consumer sets values; vBlocks uses them semantically.

- `--v-color-accent` — accent / brand color (labels, eyebrows, highlights)
- `--v-color-muted` — secondary text (descriptions, metadata, captions)
- `--v-color-fg` — primary foreground (headings, names, citations)
- `--v-color-bg` — block background surface
- `--v-color-surface` — elevated surface (cards, panels)

DSL primitive prop: `color="accent" | "muted" | "fg"` maps to the corresponding CSS variable.

## Spacing Scale
DSL props use Tailwind integer scale (1 = 0.25rem, 4 = 1rem, 6 = 1.5rem, etc.).

Common patterns observed:
- Section padding: `px={6} py={16}` (standard), `py={20}` (hero/testimonial/cta)
- Stack gaps: `gap={4}` (tight), `gap={6}` (standard), `gap={8}` (spacious)
- Grid gaps: `gap={10}`, `gap={12}`, `gap={16}` (large layouts)
- Inline gaps: `gap={3}` (button groups), `gap={1}` (inline text items)
- List: `m={0} p={0}` (reset), `gap={2}` or `gap={3}` (list items)

## Typography
Applied via `className={cn("...")}` — not DSL props (no type-scale DSL props exist).

- Hero heading: `text-5xl font-bold tracking-tight leading-tight`
- Section heading: `text-4xl font-bold tracking-tight` or `text-3xl font-bold tracking-tight`
- Card/item heading: `text-lg font-semibold` or `text-xl font-semibold`
- Label/eyebrow: `text-sm font-semibold uppercase tracking-widest` + `color="accent"`
- Body: `text-lg leading-relaxed` (primary), `text-base leading-relaxed` (standard)
- Meta/caption: `text-sm` + `color="muted"`
- Cite: `font-semibold not-italic`

## Max-Width Containers
Applied via `className={cn("...")}` — not DSL (max-width is layout structural).

- `max-w-2xl mx-auto` — narrow (CTA centered)
- `max-w-3xl mx-auto` — medium-narrow (post, centered content)
- `max-w-5xl mx-auto` — medium (testimonial, split layouts)
- `max-w-6xl mx-auto` — wide (hero, feature, footer grids)

## Depth Strategy
Border-only — no shadows. Cards/panels use `border rounded-lg` with padding (`p={4}`).
No `shadow-*` classes observed in any block.

## Component Patterns
- Block root: `<DBox as="section" aria-label={heading} style={themeStyle(theme)}>`
- DSL wrappers: `DBox`, `DStack`, `DGrid`, `DInline` (from `../../primitives`) — used for all elements including semantic HTML (`section`, `blockquote`, `ul`, `details`, etc.)
- Schema parse: `<VariantContentSchema>.parse(content)` as first statement in every block function
- List reset: `<DBox as="ul" m={0} p={0} gap={N} className={cn("list-none flex flex-col")}>`
- FAQ accordion: `<DBox as="details" p={4} className={cn("border rounded-lg")}>`
- Sticky sidebar: `<DStack gap={4} className={cn("sticky top-16")}>`
