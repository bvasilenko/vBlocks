// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Button, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { HeroCenteredContentSchema, type HeroCenteredContent } from "./schema";

export function HeroCentered({ content, theme }: BlockProps<HeroCenteredContent>) {
  HeroCenteredContentSchema.parse(content);
  const { eyebrow, heading, description, primaryCta, secondaryCta } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-3xl mx-auto px-6 py-24 gap-8 items-center text-center")}>
        {eyebrow && (
          <Box as="p" className={cn("text-sm font-semibold uppercase tracking-widest text-[var(--v-color-accent)]")}>
            {eyebrow}
          </Box>
        )}
        <Box as="h1" className={cn("text-5xl font-bold tracking-tight leading-tight")}>
          {heading}
        </Box>
        <Box as="p" className={cn("text-xl text-[var(--v-color-muted)]")}>
          {description}
        </Box>
        <Inline wrap className={cn("gap-3 justify-center")}>
          <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </Button>
          )}
        </Inline>
      </Stack>
    </Box>
  );
}
