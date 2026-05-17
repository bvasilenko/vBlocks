# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
