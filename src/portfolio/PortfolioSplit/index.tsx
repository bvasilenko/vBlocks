// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PortfolioSplitContentSchema, type PortfolioSplitContent } from "./schema";

export function PortfolioSplit({ content, theme }: BlockProps<PortfolioSplitContent>) {
  PortfolioSplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={16} align="start" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</DBox>
          {description && (
            <DBox as="p" color="muted">{description}</DBox>
          )}
        </DStack>
        <DStack gap={6}>
          {items.map((item, i) => (
            <Card key={i}>
              <DBox
                as="img"
                src={item.image.src}
                alt={item.image.alt}
                className={cn("w-full rounded-t-lg object-cover aspect-video")}
              />
              <CardContent>
                <DStack gap={2} pt={2}>
                  <Badge variant="secondary">{item.category}</Badge>
                  <DBox as="h3" className={cn("font-semibold text-lg")}>{item.title}</DBox>
                </DStack>
              </CardContent>
            </Card>
          ))}
        </DStack>
      </DGrid>
    </DBox>
  );
}
