import { useState } from "react";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { MenuEmptyState } from "./MenuEmptyState";
import { MenuFilters } from "./MenuFilters";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemDetailsSheet } from "./MenuItemDetailsSheet";
import { RestaurantBrandingHeader } from "./RestaurantBrandingHeader";
import { usePublicRestaurantBySlug } from "@/hooks/public/useRestaurants";
import type { PublicMenuItem } from "@/services/public/public.types";

export default function RestaurantMenuPage() {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<PublicMenuItem | null>(null);

  const category = searchParams.get("category");

  const { data, isPending } = usePublicRestaurantBySlug(
    restaurantSlug ?? "",
    category,
  );

  const items = data?.menuItems ?? [];
  const restaurantBranding = data?.restaurant;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-muted-foreground">
          Restaurant not found
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-restaurant-slug={restaurantSlug}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All restaurants
        </Link>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <RestaurantBrandingHeader {...restaurantBranding!} />

        <div className="mb-5 mt-10 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UtensilsCrossed className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Menu preview
            </p>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Explore the menu
            </h2>
          </div>
        </div>

        <MenuFilters categories={data.categories} />

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Select an item to view its details
          </p>
        </div>

        {items.length === 0 ? (
          <MenuEmptyState
            isFiltered={category !== "All"}
            onShowAll={() => {
              setSearchParams((prev) => {
                prev.delete("category");
                return prev;
              });
            }}
          />
        ) : (
          <section
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Menu items"
          >
            {items.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onSelect={setSelectedItem}
              />
            ))}
          </section>
        )}
      </main>

      <MenuItemDetailsSheet
        item={selectedItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
        onAddToCart={() => {}}
      />
    </div>
  );
}
