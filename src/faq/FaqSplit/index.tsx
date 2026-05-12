// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { FaqSplitContentSchema, type FaqSplitContent } from "./schema";

export function FaqSplit({ content, theme }: BlockProps<FaqSplitContent>) {
  FaqSplitContentSchema.parse(content);
  const { heading, description, items } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid columns={2} px={6} py={16} gap={16} align="start" className={cn("max-w-6xl mx-auto")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>
            {heading}
          </DBox>
          {description && (
            <DBox as="p" color="muted">
              {description}
            </DBox>
          )}
        </DStack>
        <DBox as="ul" m={0} p={0} gap={3} display="flex" className={cn("list-none flex-col")}>
          {items.map((item, i) => (
            <DBox as="li" key={i}>
              <DBox as="details" p={4} className={cn("border rounded-lg")}>
                <DBox as="summary" className={cn("font-semibold cursor-pointer list-none")}>
                  {item.question}
                </DBox>
                <DBox as="p" color="muted" mt={3}>
                  {item.answer}
                </DBox>
              </DBox>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
