import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";

export type RestaurantSort = "rating" | "deliveryTime" | "reviews";

type RestaurantFiltersProps = {
  cuisines: string[];
  searchQuery: string;
  selectedCuisine: string;
  selectedPriceLevel: number | null;
  onlyOpen: boolean;
  sortBy: RestaurantSort;
  onSearchChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onPriceLevelChange: (value: number | null) => void;
  onOnlyOpenChange: (value: boolean) => void;
  onSortChange: (value: RestaurantSort) => void;
};

export function RestaurantFilters({
  cuisines,
  searchQuery,
  selectedCuisine,
  selectedPriceLevel,
  onlyOpen,
  sortBy,
  onSearchChange,
  onCuisineChange,
  onPriceLevelChange,
  onOnlyOpenChange,
  onSortChange,
}: RestaurantFiltersProps) {
  return (
    <section
      className="space-y-4 border-b border-border pb-6"
      aria-label="Restaurant filters"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search restaurants</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by restaurant, cuisine, or location"
            className="h-10 pl-9"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <label className="sr-only" htmlFor="restaurant-price-filter">
            Price level
          </label>
          <select
            id="restaurant-price-filter"
            value={selectedPriceLevel ?? "all"}
            onChange={(event) =>
              onPriceLevelChange(
                event.target.value === "all"
                  ? null
                  : Number(event.target.value),
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option value="all">All prices</option>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
          </select>

          <label className="sr-only" htmlFor="restaurant-sort">
            Sort restaurants
          </label>
          <select
            id="restaurant-sort"
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as RestaurantSort)
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option value="rating">Top rated</option>
            <option value="deliveryTime">Fastest delivery</option>
            <option value="reviews">Most reviewed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => onCuisineChange(cuisine)}
              className={`h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition-colors ${
                selectedCuisine === cuisine
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(event) => onOnlyOpenChange(event.target.checked)}
            className="size-4 accent-primary"
          />
          <SlidersHorizontal
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Open now
        </label>
      </div>
    </section>
  );
}
