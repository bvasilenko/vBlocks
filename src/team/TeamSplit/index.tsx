// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Avatar, AvatarFallback, AvatarImage, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TeamSplitContentSchema, type TeamSplitContent } from "./schema";

export function TeamSplit({ content, theme }: BlockProps<TeamSplitContent>) {
  TeamSplitContentSchema.parse(content);
  const { heading, description, members } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} py={16} gap={16} align="start" className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={4} className={cn("sticky top-16")}>
          <DBox as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</DBox>
          {description && (
            <DBox as="p" color="muted">{description}</DBox>
          )}
        </DStack>
        <DBox as="ul" m={0} p={0} gap={6} display="flex" className={cn("list-none flex-col")}>
          {members.map((member, i) => (
            <DBox as="li" key={i}>
              <DInline gap={4} align="start">
                <Avatar>
                  <AvatarImage src={member.avatar.src} alt={member.avatar.alt} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <DStack gap={1}>
                  <DBox as="p" className={cn("font-semibold")}>{member.name}</DBox>
                  <DBox as="p" color="muted" className={cn("text-sm")}>{member.role}</DBox>
                  {member.bio && (
                    <DBox as="p" className={cn("text-sm mt-1")}>{member.bio}</DBox>
                  )}
                </DStack>
              </DInline>
            </DBox>
          ))}
        </DBox>
      </DGrid>
    </DBox>
  );
}
