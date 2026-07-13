import { RefreshCw, Store } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type Props = {
  pendingCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function AdminDashboardHeader({
  pendingCount,
  isRefreshing,
  onRefresh,
}: Props) {
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Platform overview
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Monitor restaurant applications, customers, and ordering activity.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh dashboard"
        >
          <RefreshCw
            className={isRefreshing ? "animate-spin" : undefined}
            aria-hidden="true"
          />
        </Button>
        <Link to="/admin/restaurants?status=pending">
          <Button type="button">
            <Store aria-hidden="true" />
            Review pending{pendingCount > 0 ? ` (${pendingCount})` : ""}
          </Button>
        </Link>
      </div>
    </header>
  );
}
