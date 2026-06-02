interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SidebarDrawer({ open, onClose, children }: SidebarDrawerProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Variant selector"
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-border bg-card transition-transform duration-200",
          "md:sticky md:top-14 md:z-auto md:h-[calc(100vh-3.5rem)] md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border p-3 md:hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Variants</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border px-2 py-0.5 text-xs font-semibold hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Close
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
