import { useSearchParams } from "react-router-dom";

import { RestaurantCard } from "./RestaurantCard";
import { RestaurantEmptyState } from "./RestaurantEmptyState";
import { RestaurantListHeader } from "./RestaurantListHeader";
import { RestaurantFilters } from "./RestaurantFilters";
import { usePublicRestaurants } from "@/hooks/public/useRestaurants";
import { Pagination } from "@/components/common/Pagination";

const RESTAURANTS_PER_PAGE = 12;

function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-44 animate-pulse bg-muted" />

      <div className="space-y-4 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function RestaurantGridSkeleton() {
  return (
    <section
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Loading restaurant results"
    >
      {Array.from({ length: RESTAURANTS_PER_PAGE }).map((_, index) => (
        <RestaurantCardSkeleton key={index} />
      ))}
    </section>
  );
}

export default function RestaurantListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";
  const city = searchParams.getAll("city");
  const cuisine = searchParams.getAll("cuisine");
  const onlyOpen = searchParams.get("onlyOpen") === "true";

  const { data, isLoading, isFetching } = usePublicRestaurants({
    page,
    limit: RESTAURANTS_PER_PAGE,
    search,
    city,
    cuisine,
    onlyOpen,
  });

  const restaurants = data?.restaurants ?? [];

  // Better if your backend returns something like:
  // data.pagination.totalItems or data.total
  const restaurantCount = data?.pagination.total ?? restaurants.length;

  const hasActiveFilters =
    search.trim() || city.length > 0 || cuisine.length > 0 || onlyOpen;

  const resetFilters = () => {
    const params = new URLSearchParams();

    params.set("page", "1");

    setSearchParams(params);
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("page", String(nextPage));
      nextParams.set("limit", String(RESTAURANTS_PER_PAGE));
      return nextParams;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RestaurantListHeader restaurantCount={restaurantCount} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <RestaurantFilters />

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {restaurantCount}{" "}
              {restaurantCount === 1 ? "restaurant" : "restaurants"}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Select a restaurant to view its full menu
          </p>
        </div>

        {isLoading ? (
          <RestaurantGridSkeleton />
        ) : restaurants.length === 0 ? (
          <RestaurantEmptyState
            onReset={() => {
              if (hasActiveFilters) {
                resetFilters();
              }
            }}
          />
        ) : (
          <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Restaurant results"
          >
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </section>
        )}

        <div className="mt-6">
          {data?.pagination && (
            <Pagination
              pagination={data!.pagination}
              onPageChange={handlePageChange}
              disabled={isFetching}
            />
          )}
        </div>
      </main>
    </div>
  );
}
