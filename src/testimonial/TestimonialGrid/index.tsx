// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TestimonialGridContentSchema, type TestimonialGridContent } from "./schema";

export function TestimonialGrid({ content, theme }: BlockProps<TestimonialGridContent>) {
  TestimonialGridContentSchema.parse(content);
  const { heading, items } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-6xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</DBox>
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {items.map((item, i) => (
            <Card key={i}>
              <CardContent>
                <DStack gap={4} pt={4}>
                  <DBox as="blockquote" className={cn("text-sm leading-relaxed")}>
                    <DBox as="p">{item.quote}</DBox>
                  </DBox>
                  <DInline gap={3} align="center">
                    {item.avatar && (
                      <Avatar>
                        <AvatarImage src={item.avatar.src} alt={item.avatar.alt} />
                        <AvatarFallback>{item.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <DStack className={cn("gap-0.5")}>
                      <DBox as="cite" className={cn("text-sm font-semibold not-italic")}>{item.author}</DBox>
                      <DBox as="span" color="muted" className={cn("text-xs")}>
                        {item.role}{item.company ? `, ${item.company}` : ""}
                      </DBox>
                    </DStack>
                  </DInline>
                </DStack>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
