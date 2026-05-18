// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Card, CardContent, CardHeader, CardTitle, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FaqGridContentSchema, type FaqGridContent } from "./schema";

export function FaqGrid({ content, theme }: BlockProps<FaqGridContent>) {
  FaqGridContentSchema.parse(content);
  const { heading, items } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-6xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>
          {heading}
        </DBox>
        <DGrid columns={2} gap={4}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle as="h3">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <DBox as="p" color="muted">
                  {item.answer}
                </DBox>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
