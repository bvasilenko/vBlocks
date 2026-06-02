// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { ReactNode } from "react";
import type { VbrandType } from "@booga/vbrand";
import type { CompositionSpec } from "@booga/vbrand/composition";

export type ContentOverrideMap = Record<string, unknown>;

export interface GalleryMode {
  modeId(): string;
  defaultComposition(): CompositionSpec;
  compose(
    brand: VbrandType,
    composition: CompositionSpec,
    content?: ContentOverrideMap,
  ): ReactNode;
}
