# vBlocks showcase

A reviewable host app that renders every block in `@booga/vblocks` from the
package's exported `registry` — no hardcoded list. New blocks added to the
package appear here automatically, with their default content.

Lives in the repo for review and visual regression; not shipped to npm (the
package `files` list ships only `dist/`).

## Run

```bash
cd demo
npm install
npm run dev          # http://localhost:5250
```

## Features

- Registry-driven — every block from `Object.entries(registry)`, zero
  hardcoding.
- Light / dark toggle (vTheme `darkMode: class`).
- Category filter chips (12 categories + All).
- Sticky TOC sidebar grouped by category, click-to-scroll.
- Per-block frame with the `category/variant` id and a variant chip.
- Real photos (`picsum.photos`) swapped in for placeholder URLs.

## Why registry-driven

`vBlocks/src/registry.ts` exports `registry: Record<BlockId, { component,
schema, default }>`. The demo iterates it — so a new block added in vBlocks
needs zero demo edit; it self-inserts at the next dev/build. The same registry
also makes the demo a living visual harness: every block must render with its
shipped default content, or the demo breaks.
