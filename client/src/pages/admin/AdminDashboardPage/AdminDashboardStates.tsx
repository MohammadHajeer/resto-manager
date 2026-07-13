import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-8 w-56" /><Skeleton className="h-4 w-80 max-w-full" /></div>
        <Skeleton className="hidden h-9 w-44 sm:block" />
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}><CardContent className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-20" /><Skeleton className="h-3 w-full" /></CardContent></Card>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,1fr)]">
        {[0, 1].map((index) => <Card key={index}><CardHeader><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-56" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>)}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,1fr)]">
        {[0, 1].map((index) => <Card key={index}><CardHeader><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-64" /></CardHeader><CardContent><Skeleton className="h-56 w-full" /></CardContent></Card>)}
      </section>
      <Card><CardHeader><Skeleton className="h-5 w-36" /></CardHeader><CardContent><Skeleton className="h-44 w-full" /></CardContent></Card>
    </main>
  );
}

export function AdminDashboardErrorState({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <section className="max-w-md rounded-xl border border-destructive/20 bg-card px-8 py-10 text-center shadow-sm">
        <AlertCircle className="mx-auto size-9 text-destructive" aria-hidden="true" />
        <h1 className="mt-4 text-lg font-semibold text-foreground">Dashboard data could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Check the connection and try again. No failed request values have been replaced with placeholder data.</p>
        <Button type="button" variant="outline" className="mt-5" onClick={onRetry} disabled={isRetrying}>
          <RefreshCw className={isRetrying ? "animate-spin" : undefined} aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
