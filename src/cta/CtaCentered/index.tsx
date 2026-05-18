// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, cn } from "@booga/vui";
import { DBox, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { CtaCenteredContentSchema, type CtaCenteredContent } from "./schema";

export function CtaCentered({ content, theme }: BlockProps<CtaCenteredContent>) {
  CtaCenteredContentSchema.parse(content);
  const { heading, description, primaryCta, secondaryCta } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} gap={8} align="center" className={cn("max-w-2xl mx-auto text-center py-20")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>
          {heading}
        </DBox>
        <DBox as="p" color="muted" className={cn("text-lg")}>
          {description}
        </DBox>
        <DInline wrap gap={3} justify="center">
          <Button as="a" href={primaryCta.href} size="lg">{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} size="lg" variant="outline">
              {secondaryCta.label}
            </Button>
          )}
        </DInline>
      </DStack>
    </DBox>
  );
}
