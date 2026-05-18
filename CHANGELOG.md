# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
