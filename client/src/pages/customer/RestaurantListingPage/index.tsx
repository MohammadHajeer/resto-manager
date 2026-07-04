import { useMemo, useState } from "react";

import { RestaurantCard } from "./RestaurantCard";
import { RestaurantEmptyState } from "./RestaurantEmptyState";
import {
  RestaurantFilters,
  type RestaurantSort,
} from "./RestaurantFilters";
import { RestaurantListHeader } from "./RestaurantListHeader";
import { restaurants } from "./restaurants.data";

const allCuisines = [
  "All",
  ...Array.from(
    new Set(restaurants.flatMap((restaurant) => restaurant.cuisineTypes)),
  ),
];

function getDeliveryStart(deliveryTime: string) {
  return Number.parseInt(deliveryTime, 10) || Number.MAX_SAFE_INTEGER;
}

export default function RestaurantListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<number | null>(
    null,
  );
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState<RestaurantSort>("rating");

  const visibleRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return restaurants
      .filter((restaurant) => {
        const searchableText = [
          restaurant.name,
          restaurant.description,
          restaurant.location,
          ...restaurant.cuisineTypes,
        ]
          .join(" ")
          .toLowerCase();
        const matchesSearch = !query || searchableText.includes(query);
        const matchesCuisine =
          selectedCuisine === "All" ||
          restaurant.cuisineTypes.includes(selectedCuisine);
        const matchesPrice =
          selectedPriceLevel === null ||
          restaurant.priceLevel === selectedPriceLevel;
        const matchesAvailability = !onlyOpen || restaurant.isOpen;

        return (
          matchesSearch &&
          matchesCuisine &&
          matchesPrice &&
          matchesAvailability
        );
      })
      .toSorted((a, b) => {
        if (sortBy === "deliveryTime") {
          return (
            getDeliveryStart(a.deliveryTime) -
            getDeliveryStart(b.deliveryTime)
          );
        }

        if (sortBy === "reviews") {
          return b.reviewsCount - a.reviewsCount;
        }

        return b.rating - a.rating;
      });
  }, [onlyOpen, searchQuery, selectedCuisine, selectedPriceLevel, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("All");
    setSelectedPriceLevel(null);
    setOnlyOpen(false);
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RestaurantListHeader restaurantCount={restaurants.length} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <RestaurantFilters
          cuisines={allCuisines}
          searchQuery={searchQuery}
          selectedCuisine={selectedCuisine}
          selectedPriceLevel={selectedPriceLevel}
          onlyOpen={onlyOpen}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onCuisineChange={setSelectedCuisine}
          onPriceLevelChange={setSelectedPriceLevel}
          onOnlyOpenChange={setOnlyOpen}
          onSortChange={setSortBy}
        />

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">
            {visibleRestaurants.length}{" "}
            {visibleRestaurants.length === 1 ? "restaurant" : "restaurants"}
          </p>
          <p className="text-xs text-muted-foreground">
            Select a restaurant to view its full menu
          </p>
        </div>

        {visibleRestaurants.length === 0 ? (
          <RestaurantEmptyState onReset={resetFilters} />
        ) : (
          <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Restaurant results"
          >
            {visibleRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
