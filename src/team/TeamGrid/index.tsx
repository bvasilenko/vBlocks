// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TeamGridContentSchema, type TeamGridContent } from "./schema";

export function TeamGrid({ content, theme }: BlockProps<TeamGridContent>) {
  TeamGridContentSchema.parse(content);
  const { heading, members } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-5xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</DBox>
        <DGrid columns={3} gap={6}>
          {members.map((member, i) => (
            <Card key={i}>
              <CardContent>
                <DStack gap={3} align="center" pt={4} className={cn("text-center")}>
                  <Avatar className={cn("w-16 h-16")}>
                    <AvatarImage src={member.avatar.src} alt={member.avatar.alt} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <DStack gap={1}>
                    <DBox as="p" className={cn("font-semibold")}>{member.name}</DBox>
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
