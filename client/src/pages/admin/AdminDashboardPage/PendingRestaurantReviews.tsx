import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardResponse } from "@/services/admin/admin.types";

import { formatDate } from "./dashboard-utils";

export function PendingRestaurantReviews({
  restaurants,
}: {
  restaurants: AdminDashboardResponse["pendingRestaurants"];
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="grid-cols-[1fr_auto]">
        <div>
          <CardTitle>Pending restaurant reviews</CardTitle>
          <CardDescription>Latest applications that require an admin decision.</CardDescription>
        </div>
        {restaurants.length > 0 && (
          <Link to="/admin/restaurants?status=pending" className="hidden sm:block">
            <Button type="button" variant="outline" size="sm">View all</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {restaurants.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-primary/5 px-6 text-center">
            <CheckCircle2 className="size-9 text-primary" aria-hidden="true" />
            <p className="mt-3 font-semibold text-foreground">
              All restaurant applications have been reviewed.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">There is nothing waiting for your attention.</p>
          </div>
        ) : (
          <div className="divide-y">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
                    {restaurant.logoUrl ? (
                      <img src={restaurant.logoUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <Store className="size-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{restaurant.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {restaurant.ownerName ?? "Owner unavailable"} · {restaurant.city}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {restaurant.cuisineTypes.length > 0
                        ? restaurant.cuisineTypes.join(", ")
                        : "Cuisine not specified"} · {formatDate(restaurant.createdAt)}
                    </p>
                  </div>
                </div>
                <Link to={`/admin/restaurants/${restaurant.id}`} className="sm:shrink-0">
                  <Button type="button" size="sm" className="w-full sm:w-auto">
                    Review <ArrowRight aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
