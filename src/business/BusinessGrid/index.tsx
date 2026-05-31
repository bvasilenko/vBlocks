// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Card, CardContent, CardHeader, CardTitle, Eyebrow, Kicker, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, themeStyle } from "../../theme";
import { BusinessGridContentSchema, type BusinessGridContent } from "./schema";

export function BusinessGrid({ content, theme }: BlockProps<BusinessGridContent>) {
  BusinessGridContentSchema.parse(content);
  const { kicker, eyebrow, heading, services, tonePills, density } = content;
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
        <DGrid gap={6} className={cn("grid-cols-1 sm:grid-cols-2")}>
          {services.map((service, i) => (
            <Card key={i}>
              <CardHeader>
                <DStack gap={2}>
                  {service.icon && (
                    <DBox as="span" className={cn("text-2xl")} aria-hidden="true">{service.icon}</DBox>
                  )}
                  <CardTitle as="h3" className={cn("font-serif font-medium")}>{service.title}</CardTitle>
                </DStack>
              </CardHeader>
              <CardContent>
                <DBox as="p" color="muted" className={cn("text-sm")}>{service.description}</DBox>
              </CardContent>
            </Card>
          ))}
        </DGrid>
      </DStack>
    </DBox>
  );
}
