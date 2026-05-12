// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Box, Button, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { CtaCenteredContentSchema, type CtaCenteredContent } from "./schema";

export function CtaCentered({ content, theme }: BlockProps<CtaCenteredContent>) {
  CtaCenteredContentSchema.parse(content);
  const { heading, description, primaryCta, secondaryCta } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-2xl mx-auto px-6 py-20 gap-8 items-center text-center")}>
        <Box as="h2" className={cn("text-4xl font-bold tracking-tight")}>
          {heading}
        </Box>
        <Box as="p" className={cn("text-lg text-[var(--v-color-muted)]")}>
          {description}
        </Box>
        <Inline wrap className={cn("gap-3 justify-center")}>
          <Button as="a" href={primaryCta.href} size="lg">{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} size="lg" variant="outline">
              {secondaryCta.label}
            </Button>
          )}
        </Inline>
      </Stack>
    </Box>
  );
}
