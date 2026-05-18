// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FeaturesSplitContentSchema, type FeaturesSplitContent } from "./schema";

export function FeaturesSplit({ content, theme }: BlockProps<FeaturesSplitContent>) {
  FeaturesSplitContentSchema.parse(content);
  const { heading, description, features } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={16} align="start" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</DBox>
          {description && (
            <DBox as="p" color="muted" className={cn("text-lg")}>{description}</DBox>
          )}
        </DStack>
        <DBox as="ul" m={0} p={0} gap={8} display="flex" className={cn("list-none flex-col")}>
          {features.map((feature, i) => (
            <DBox as="li" key={i}>
              <DInline gap={4} align="start">
                {feature.icon && (
                  <DBox as="span" className={cn("text-xl flex-shrink-0 mt-0.5")} aria-hidden="true">
                    {feature.icon}
                  </DBox>
                )}
                <DStack gap={1}>
                  <DBox as="h3" className={cn("text-lg font-semibold")}>{feature.title}</DBox>
                  <DBox as="p" color="muted" className={cn("text-sm")}>{feature.description}</DBox>
                </DStack>
              </DInline>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
