// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { CtaSplitContentSchema, type CtaSplitContent } from "./schema";

export function CtaSplit({ content, theme }: BlockProps<CtaSplitContent>) {
  CtaSplitContentSchema.parse(content);
  const { heading, description, primaryCta, image } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={12} align="center" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={6}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>
            {heading}
          </DBox>
          <DBox as="p" color="muted" className={cn("text-lg")}>
            {description}
          </DBox>
          <Button as="a" href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
        </DStack>
        <DBox
          as="img"
          src={image.src}
          alt={image.alt}
          className={cn("w-full rounded-lg object-cover aspect-video")}
        />
      </DGrid>
    </DBox>
  );
}
