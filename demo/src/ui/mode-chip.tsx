interface ModeChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function ModeChip({ active, onClick, children }: ModeChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "rounded-full px-2.5 py-1 text-xs font-medium transition duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
        (active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground")
      }
    >
      {children}
    </button>
  );
}
