import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type RestaurantListHeaderProps = {
  restaurantCount: number;
};

export function RestaurantListHeader({
  restaurantCount,
}: RestaurantListHeaderProps) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Store className="size-4" aria-hidden="true" />
            {restaurantCount} restaurants ready to explore
          </div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Find your next favorite meal
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Browse local restaurants, compare delivery details, and open the
            full menu when something catches your eye.
          </p>
        </div>

        <Button
          nativeButton={false}
          size="lg"
          className="w-fit rounded-full"
          render={<Link to="/restaurant/register" />}
        >
          Register your restaurant
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
