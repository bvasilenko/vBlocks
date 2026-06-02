interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive"
    >
      <span className="min-w-0 flex-1 break-words">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 rounded border border-destructive/40 px-2 py-0.5 text-xs font-semibold hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Dismiss
      </button>
    </div>
  );
}
