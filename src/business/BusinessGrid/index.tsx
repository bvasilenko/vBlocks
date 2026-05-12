// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Card, CardContent, CardHeader, CardTitle, cn } from "@booga/vui";
import { DBox, DGrid, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { themeStyle } from "../../theme";
import { BusinessGridContentSchema, type BusinessGridContent } from "./schema";

export function BusinessGrid({ content, theme }: BlockProps<BusinessGridContent>) {
  BusinessGridContentSchema.parse(content);
  const { heading, services } = content;
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DStack px={6} py={16} className={cn("max-w-5xl mx-auto gap-10")}>
        <DBox as="h2" className={cn("text-3xl font-bold tracking-tight text-center")}>{heading}</DBox>
        <DGrid columns={2} gap={6}>
          {services.map((service, i) => (
            <Card key={i}>
              <CardHeader>
                <DStack gap={2}>
                  {service.icon && (
                    <DBox as="span" className={cn("text-2xl")} aria-hidden="true">{service.icon}</DBox>
                  )}
                  <CardTitle as="h3">{service.title}</CardTitle>
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
