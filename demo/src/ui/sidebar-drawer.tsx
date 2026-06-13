// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from "react";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label?: string;
}

export function SidebarDrawer({ open, onClose, children, label = "Variant selector" }: SidebarDrawerProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-background/80 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label={label}
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-border/80 bg-card transition-transform duration-200",
          "md:sticky md:top-14 md:z-auto md:h-[calc(100vh-3.5rem)] md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card p-3 md:hidden">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide transition duration-150 hover:border-accent/60 hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Close
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
