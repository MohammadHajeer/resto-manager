import { useOwnerKitchenOrders } from "@/hooks/owner/userOwnerOrders";
import { KitchenHeader } from "./KitchenHeader";
import { KitchenStatsBar } from "./KitchenStatsBar";
import { KitchenBoard } from "./KitchenBoard";

export default function OwnerOrdersPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useOwnerKitchenOrders();

  if (isLoading) {
    return (
      <main className="space-y-6">
        <div className="h-20 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-4">
          <div className="h-24 animate-pulse rounded-3xl bg-muted" />
          <div className="h-24 animate-pulse rounded-3xl bg-muted" />
          <div className="h-24 animate-pulse rounded-3xl bg-muted" />
          <div className="h-24 animate-pulse rounded-3xl bg-muted" />
        </div>
        <div className="h-130 animate-pulse rounded-3xl bg-muted" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-lg font-semibold text-destructive">
            Failed to load orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <KitchenHeader onRefresh={refetch} isRefreshing={isFetching} />

      <KitchenStatsBar counts={data.counts} />

      <KitchenBoard columns={data.columns} />
    </main>
  );
}
