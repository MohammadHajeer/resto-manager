import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OwnerDashboardSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-28 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </main>
  );
}

type OwnerDashboardErrorStateProps = {
  onRetry: () => void;
  isRetrying: boolean;
};

export function OwnerDashboardErrorState({
  onRetry,
  isRetrying,
}: OwnerDashboardErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <Card className="w-full text-center">
        <CardContent className="flex flex-col items-center py-10">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Dashboard unavailable</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            We couldn’t load the restaurant overview. Check your connection and try again.
          </p>
          <Button className="mt-5" onClick={onRetry} disabled={isRetrying}>
            <RefreshCw className={isRetrying ? "animate-spin" : ""} aria-hidden="true" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
