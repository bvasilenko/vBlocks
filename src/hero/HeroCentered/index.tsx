// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, cn } from "@booga/vui";
import { DBox, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { HeroCenteredContentSchema, type HeroCenteredContent } from "./schema";

export function HeroCentered({ content, theme }: BlockProps<HeroCenteredContent>) {
  HeroCenteredContentSchema.parse(content);
  const { eyebrow, heading, description, primaryCta, secondaryCta } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={24} gap={8} align="center" className={cn("max-w-3xl mx-auto text-center")}>
        {eyebrow && (
          <DBox as="p" color="accent" className={cn("text-sm font-semibold uppercase tracking-widest")}>
            {eyebrow}
          </DBox>
        )}
        <DBox as="h1" className={cn("text-5xl font-bold tracking-tight leading-tight")}>
          {heading}
        </DBox>
        <DBox as="p" color="muted" className={cn("text-xl")}>
          {description}
        </DBox>
        <DInline wrap gap={3} justify="center">
          <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </Button>
          )}
        </DInline>
      </DStack>
    </DBox>
  );
}
