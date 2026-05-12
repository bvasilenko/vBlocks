// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { type ElementType } from "react";
import { dsl } from "@booga/vdsl";
import { Box, Stack, Grid, Inline } from "@booga/vui";

// PolymorphicComponent is not structurally assignable to ElementType; dsl() uses
// createElement() at runtime which accepts any callable, so the bridge is safe.
export const DBox    = dsl(Box    as unknown as ElementType);
export const DStack  = dsl(Stack  as unknown as ElementType);
export const DGrid   = dsl(Grid   as unknown as ElementType);
export const DInline = dsl(Inline as unknown as ElementType);
