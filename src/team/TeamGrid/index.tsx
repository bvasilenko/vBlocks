import { Avatar, AvatarFallback, AvatarImage, Box, Card, CardContent, Grid, Stack, cn } from "@booga/vui";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { TeamGridContentSchema, type TeamGridContent } from "./schema";

export function TeamGrid({ content, theme }: BlockProps<TeamGridContent>) {
  TeamGridContentSchema.parse(content);
  const { heading, members } = content;
  return (
    <Box as="section" aria-label={heading} style={themeStyle(theme)}>
      <Stack className={cn("max-w-5xl mx-auto px-6 py-16 gap-10")}>
        <Box as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</Box>
        <Grid columns={3} className={cn("gap-6")}>
          {members.map((member, i) => (
            <Card key={i}>
              <CardContent>
                <Stack className={cn("gap-3 items-center text-center pt-4")}>
                  <Avatar className={cn("w-16 h-16")}>
                    <AvatarImage src={member.avatar.src} alt={member.avatar.alt} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Stack className={cn("gap-1")}>
                    <Box as="p" className={cn("font-semibold")}>{member.name}</Box>
                    <Box as="p" className={cn("text-sm text-[var(--v-color-muted)]")}>{member.role}</Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
