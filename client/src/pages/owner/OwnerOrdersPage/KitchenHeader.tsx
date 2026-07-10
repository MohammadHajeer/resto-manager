import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type KitchenHeaderProps = {
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function KitchenHeader({ onRefresh, isRefreshing }: KitchenHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Kitchen Live View
          </h1>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Live
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Track active orders and move them through preparation.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
