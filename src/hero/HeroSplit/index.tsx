// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { Button, Eyebrow, Kicker, Lead, Pill, cn } from "@booga/vui";
import { DBox, DGrid, DInline, DStack } from "../../primitives";
import { type BlockProps } from "../../types";
import { densityPy, densityPb, themeStyle } from "../../theme";
import { HeroSplitContentSchema, type HeroSplitContent, type HeroSplitImage } from "./schema";

function activateImageFallback(image: HTMLImageElement, fallbackSrc: string | undefined): void {
  if (!fallbackSrc || image.dataset.vblocksFallbackApplied === "true") return;
  if (image.currentSrc === fallbackSrc || image.src === fallbackSrc) return;
  image.dataset.vblocksFallbackApplied = "true";
  image.src = fallbackSrc;
}

function imageErrorHandler(image: HeroSplitImage): React.ReactEventHandler<HTMLImageElement> | undefined {
  if (!image.fallbackSrc) return undefined;
  return (event) => activateImageFallback(event.currentTarget, image.fallbackSrc);
}

export function HeroSplit({ content, theme }: BlockProps<HeroSplitContent>) {
  HeroSplitContentSchema.parse(content);
  const { kicker, eyebrow, heading, description, primaryCta, secondaryCta, tonePills, density, image, presentation } = content;
  const ctaAnchored = presentation?.spacing === "cta-anchored";
  const scaleDownImage = presentation?.imageFit === "scale-down";
  const layoutSpacing = ctaAnchored
    ? { pt: densityPy(density), pb: densityPb(density) }
    : { py: densityPy(density) };
  const imageCellClassName = scaleDownImage
    ? "relative overflow-hidden rounded-lg border border-border bg-[color:var(--v-color-surface)] aspect-video lg:aspect-auto lg:self-stretch"
    : "";
  const imageClassName = scaleDownImage
    ? "absolute inset-0 w-full h-full object-scale-down p-6 sm:p-8"
    : "w-full rounded-lg object-cover aspect-video";
  const onImageError = imageErrorHandler(image);
  return (
    <DBox as="section" aria-label={heading} style={themeStyle(theme)}>
      <DGrid px={6} {...layoutSpacing} gap={12} align={ctaAnchored ? "start" : "center"} className={cn("max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2")}>
        <DStack gap={6}>
          {kicker && <Kicker className={cn("self-start")}>{kicker}</Kicker>}
          {eyebrow && <Eyebrow tone="info">{eyebrow}</Eyebrow>}
          <DBox as="h1" className={cn("font-serif font-medium tracking-tight leading-tight text-[clamp(2.3rem,4.2vw,3.2rem)]")}>
            {heading}
          </DBox>
          <Lead>{description}</Lead>
          {tonePills && tonePills.length > 0 && (
            <DInline wrap gap={2}>
              {tonePills.map((pill, i) => (
                <Pill key={i} tone={pill.tone}>{pill.label}</Pill>
              ))}
            </DInline>
          )}
          <DInline wrap gap={3}>
            <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
            {secondaryCta && (
              <Button as="a" href={secondaryCta.href} variant="outline">
                {secondaryCta.label}
              </Button>
            )}
          </DInline>
        </DStack>
        {scaleDownImage ? (
          <DBox className={cn(imageCellClassName)}>
            <DBox
              as="img"
              src={image.src}
              alt={image.alt}
              className={cn(imageClassName)}
              onError={onImageError}
            />
          </DBox>
        ) : (
          <DBox
            as="img"
            src={image.src}
            alt={image.alt}
            className={cn(imageClassName)}
            onError={onImageError}
          />
        )}
      </DGrid>
    </DBox>
  );
}
