// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Button, Grid, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { HeroSplitContentSchema, type HeroSplitContent } from "./schema";

export function HeroSplit({ content, theme }: BlockProps<HeroSplitContent>) {
  HeroSplitContentSchema.parse(content);
  const { eyebrow, heading, description, primaryCta, secondaryCta, image } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-12 items-center")}>
        <Stack className={cn("gap-6")}>
          {eyebrow && (
            <Box as="p" className={cn("text-sm font-semibold uppercase tracking-widest text-[var(--v-color-accent)]")}>
              {eyebrow}
            </Box>
          )}
          <Box as="h1" className={cn("text-5xl font-bold tracking-tight leading-tight")}>
            {heading}
          </Box>
          <Box as="p" className={cn("text-lg text-[var(--v-color-muted)]")}>
            {description}
          </Box>
          <Inline wrap className={cn("gap-3")}>
            <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
            {secondaryCta && (
              <Button as="a" href={secondaryCta.href} variant="outline">
                {secondaryCta.label}
              </Button>
            )}
          </Inline>
        </Stack>
        <Box
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-video")}
        />
      </Grid>
    </Box>
  );
}
