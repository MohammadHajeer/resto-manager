import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantMenuPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      aria-busy="true"
      aria-label="Loading restaurant menu"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-32" />
      </div>

      <main className="mx-auto mb-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="h-48 w-full rounded-none sm:h-64 lg:h-72" />
          <div className="px-4 pb-6 sm:px-7 sm:pb-8">
            <Skeleton className="relative -mt-12 size-24 rounded-2xl border-4 border-card sm:-mt-15 sm:size-30" />
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl flex-1 space-y-3">
                <Skeleton className="h-8 w-64 max-w-full sm:h-10" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-card px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-56 max-w-full" />
            </div>
            <Skeleton className="h-7 w-24 rounded-2xl" />
          </div>
        </section>

        <div className="mb-5 mt-9 flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        <div className="flex gap-2 overflow-hidden" aria-hidden="true">
          {[72, 96, 112, 88, 104].map((width) => (
            <Skeleton
              key={width}
              className="h-9 shrink-0 rounded-full"
              style={{ width }}
            />
          ))}
        </div>

        <div className="mb-5 mt-6 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="hidden h-3 w-48 sm:block" />
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="aspect-16/10 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <div className="flex justify-between gap-4">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
