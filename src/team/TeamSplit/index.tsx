import { Avatar, AvatarFallback, AvatarImage, Box, Grid, Inline, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TeamSplitContentSchema, type TeamSplitContent } from "./schema";

export function TeamSplit({ content, theme }: BlockProps<TeamSplitContent>) {
  TeamSplitContentSchema.parse(content);
  const { heading, description, members } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Grid columns={2} className={cn("max-w-6xl mx-auto px-6 py-16 gap-16 items-start")}>
        <Stack className={cn("gap-4 sticky top-16")}>
          <Box as="h2" className={cn("text-3xl font-bold tracking-tight")}>{heading}</Box>
          {description && (
            <Box as="p" className={cn("text-[var(--v-color-muted)]")}>{description}</Box>
          )}
        </Stack>
        <Box as="ul" className={cn("list-none m-0 p-0 flex flex-col gap-6")}>
          {members.map((member, i) => (
            <Box as="li" key={i}>
              <Inline className={cn("gap-4 items-start")}>
                <Avatar>
                  <AvatarImage src={member.avatar.src} alt={member.avatar.alt} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Stack className={cn("gap-1")}>
                  <Box as="p" className={cn("font-semibold")}>{member.name}</Box>
                  <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{member.role}</Box>
                  {member.bio && (
                    <Box as="p" className={cn("text-sm mt-1")}>{member.bio}</Box>
                  )}
                </Stack>
              </Inline>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
