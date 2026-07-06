import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton() {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <Skeleton className="h-11 w-11 rounded-2xl" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <div className="space-y-5">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandIdentitySkeleton() {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-3">
          <Skeleton className="h-44 w-full rounded-2xl md:h-56" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-5">
          <Skeleton className="h-28 w-28 rounded-full" />

          <div className="mt-4 space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-28" />
            <Skeleton className="mx-auto h-3 w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}

function OpeningHoursSkeleton() {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <Skeleton className="h-11 w-11 rounded-2xl" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-background">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 px-4 py-4 sm:grid-cols-[190px_1fr_90px] sm:items-center"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-11 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:max-w-md">
              <Skeleton className="h-10 rounded-full" />
              <Skeleton className="h-4 w-5" />
              <Skeleton className="h-10 rounded-full" />
            </div>

            <Skeleton className="h-7 w-20 rounded-full sm:justify-self-end" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityCardSkeleton() {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-20 rounded-2xl md:w-72" />
      </div>

      <Skeleton className="mt-5 h-20 rounded-2xl" />
    </section>
  );
}

export default function SkeletonLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <BrandIdentitySkeleton />

      <SectionSkeleton />

      <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6 flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6 flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-72 rounded-2xl" />
      </section>

      <OpeningHoursSkeleton />

      <ActivityCardSkeleton />
    </div>
  );
}