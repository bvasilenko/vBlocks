// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Badge, Card, CardContent, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { PortfolioGridContentSchema, type PortfolioGridContent } from "./schema";

export function PortfolioGrid({ content, theme }: BlockProps<PortfolioGridContent>) {
  PortfolioGridContentSchema.parse(content);
  const { items } = content;
  return (
    <DBox as="section" aria-label="Portfolio" style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={12} gap={6} className={cn("max-w-6xl mx-auto")}>
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
                <Badge variant="secondary" className={cn("self-start")}>{item.category}</Badge>
                <DBox as="h3" className={cn("font-semibold text-lg")}>{item.title}</DBox>
              </DStack>
            </CardContent>
          </Card>
        ))}
      </DGrid>
    </DBox>
  );
}
