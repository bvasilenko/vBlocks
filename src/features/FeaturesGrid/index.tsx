// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Card, CardContent, CardHeader, CardTitle, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FeaturesGridContentSchema, type FeaturesGridContent } from "./schema";

export function FeaturesGrid({ content, theme }: BlockProps<FeaturesGridContent>) {
  FeaturesGridContentSchema.parse(content);
  const { heading, features } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-6xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</DBox>
        <DGrid columns={3} gap={6}>
          {features.map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <DStack gap={2}>
                  {feature.icon && (
                    <DBox as="span" className={cn("text-xl")} aria-hidden="true">{feature.icon}</DBox>
                  )}
                  <CardTitle as="h3">{feature.title}</CardTitle>
                </DStack>
              </CardHeader>
              <CardContent>
                <DBox as="p" color="muted" className={cn("text-sm")}>{feature.description}</DBox>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
