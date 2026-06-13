// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { useEffect, useRef } from "react";
import {
  sectionsByOrder,
  updateSection,
  compositionFromHash,
  type CompositionSpec,
  type Density,
} from "@booga/vbrand/composition";
import { writeCompositionHash } from "../routing/composition-hash";

const DENSITIES: readonly Density[] = ["compact", "regular", "spacious"];

interface CatalogDrawerProps {
  spec: CompositionSpec;
  defaultSpec: CompositionSpec;
  onChange: (spec: CompositionSpec) => void;
}

export function CatalogDrawer({ spec, defaultSpec, onChange }: CatalogDrawerProps) {
  const hashLoaded = useRef(false);

  useEffect(() => {
    if (hashLoaded.current) return;
    hashLoaded.current = true;
    const loaded = compositionFromHash(window.location.hash.slice(1));
    if (loaded) onChange(loaded);
  }, [onChange]);

  useEffect(() => {
    writeCompositionHash(spec);
  }, [spec]);

  return (
    <div className="flex flex-col overflow-y-auto border-l border-border/60 bg-card p-3 font-mono">
      <div className="mb-3 flex items-center justify-between border-b border-border/80 bg-card px-1 pb-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Catalog matrix
        </span>
        <button
          type="button"
          onClick={() => onChange(defaultSpec)}
          className="rounded-full border border-border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide transition duration-150 hover:border-accent/60 hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Reset
        </button>
      </div>

      <ul className="flex flex-col gap-2" role="list" aria-label="Section list">
        {sectionsByOrder(spec).map((section) => (
          <li
            key={section.id}
            className={
              "group flex flex-col gap-2 rounded-lg border border-l-4 bg-background/80 p-3 transition-colors hover:bg-accent/5 focus-within:border-accent/70 focus-within:bg-accent/5 focus-within:ring-1 focus-within:ring-ring/40 " +
              (section.visible
                ? "border-border/80 border-l-accent/50 hover:border-accent/60"
                : "border-border/60 border-l-border text-muted-foreground")
            }
          >
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`catalog-vis-${section.id.replace("/", "-")}`}
                checked={section.visible}
                onChange={() =>
                  onChange(updateSection(spec, section.id, { visible: !section.visible }))
                }
                className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <label
                htmlFor={`catalog-vis-${section.id.replace("/", "-")}`}
                className={
                  "grid flex-1 cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-2 font-mono uppercase " +
                  (section.visible ? "text-foreground" : "text-muted-foreground/80 line-through decoration-border")
                }
              >
                <span className="rounded-full border border-border bg-card px-1.5 py-0.5 text-center text-[10px] font-bold tabular-nums tracking-wider text-muted-foreground transition-colors group-hover:border-accent/60 group-hover:text-accent">
                  {String(section.order + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-[10px] font-semibold tracking-wide">
                  <span className="tracking-wider text-muted-foreground">{section.id.split("/")[0]}</span>
                  <span className="px-1 text-muted-foreground/60">/</span>
                  <span className="text-foreground">{section.id.split("/")[1]}</span>
                </span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-1 pl-14">
              {DENSITIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={!section.visible}
                  aria-pressed={section.density === d}
                  onClick={() => onChange(updateSection(spec, section.id, { density: d }))}
                  className={
                    "min-w-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 " +
                    (section.density === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-accent/60 hover:bg-accent hover:text-accent-foreground")
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
