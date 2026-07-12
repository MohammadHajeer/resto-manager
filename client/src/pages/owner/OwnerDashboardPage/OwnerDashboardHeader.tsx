import { ExternalLink, RefreshCw, Store } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OwnerDashboardResponse } from "@/services/owner/owner.types";

type OwnerDashboardHeaderProps = {
  restaurant: OwnerDashboardResponse["restaurant"];
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function OwnerDashboardHeader({
  restaurant,
  isRefreshing,
  onRefresh,
}: OwnerDashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Store className="size-6" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {restaurant.name}
            </h2>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full",
                restaurant.isOpen
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {restaurant.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A live overview of orders and menu availability.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" render={<Link to={`/restaurants/${restaurant.slug}`} />}>
          <ExternalLink aria-hidden="true" />
          View restaurant
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Refresh dashboard"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn(isRefreshing && "animate-spin")}
            aria-hidden="true"
          />
        </Button>
      </div>
    </section>
  );
}
