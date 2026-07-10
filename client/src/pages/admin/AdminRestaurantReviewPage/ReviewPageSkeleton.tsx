export function ReviewPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading restaurant review</span>
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-6">
          {["h-44", "h-36", "h-32"].map((heightClass) => (
            <div
              key={heightClass}
              className="animate-pulse rounded-md border border-border bg-card p-6"
            >
              <div className="h-5 w-40 rounded bg-muted" />
              <div className={`mt-5 ${heightClass} rounded bg-muted/70`} />
            </div>
          ))}
        </div>
        <div className="h-128 animate-pulse rounded-md border border-border bg-card" />
      </div>
    </div>
  );
}
