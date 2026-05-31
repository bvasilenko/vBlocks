// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { TeamGridContentSchema, type TeamGridContent } from "./schema";

export function TeamGrid({ content, theme }: BlockProps<TeamGridContent>) {
  TeamGridContentSchema.parse(content);
  const { kicker, eyebrow, heading, members, tonePills, density } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={densityPy(density)} className={cn("max-w-6xl mx-auto gap-10")}>
        <DStack gap={3} align="center" className={cn("text-center")}>
          {kicker && <Kicker>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h2" className={cn("font-serif font-medium tracking-tight text-[clamp(1.65rem,2.8vw,2.15rem)]")}>{heading}</DBox>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2} justify="center">
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
        </DStack>
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {members.map((member, i) => (
            <Card key={i}>
              <CardContent>
                <DStack gap={4} align="center" py={6} className={cn("text-center")}>
                  <Avatar className={cn("w-16 h-16")}>
                    <AvatarImage src={member.avatar.src} alt={member.avatar.alt} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <DStack gap={1}>
                    <DBox as="p" className={cn("font-serif font-medium")}>{member.name}</DBox>
                    <DBox as="p" color="muted" className={cn("text-sm")}>{member.role}</DBox>
                  </DStack>
                </DStack>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
