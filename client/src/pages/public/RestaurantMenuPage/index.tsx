import { useMemo, useState } from "react";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import {
  MenuEmptyState,
  type MenuEmptyStateVariant,
} from "./MenuEmptyState";
import { MenuFilters } from "./MenuFilters";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemDetailsSheet } from "./MenuItemDetailsSheet";
import { RestaurantBrandingHeader } from "./RestaurantBrandingHeader";
import { RestaurantMenuPageSkeleton } from "./RestaurantMenuPageSkeleton";
import { RestaurantOpeningHours } from "./RestaurantOpeningHours";
import { usePublicRestaurantBySlug } from "@/hooks/public/useRestaurants";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartStore } from "@/stores/useCartStore";
import type {
  PublicMenuAddon,
  PublicMenuItem,
} from "@/services/public/public.types";

export default function RestaurantMenuPage() {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<PublicMenuItem | null>(null);

  const category = searchParams.get("category");
  const rawSearch = searchParams.get("search") ?? "";
  const debouncedSearch = useDebounce(rawSearch, 300);

  const restaurantQuery = usePublicRestaurantBySlug(
    restaurantSlug ?? "",
    category,
  );
  const fullMenuQuery = usePublicRestaurantBySlug(restaurantSlug ?? "", null);
  const data = restaurantQuery.data;
  const fullMenuData = fullMenuQuery.data;

  const addItem = useCartStore((state) => state.addItem);
  const cartRestaurantId = useCartStore((state) => state.restaurantId);

  // RES-75: debounced client-side search over the already-loaded menu
  // items — no extra API call needed since all items are fetched by the
  // slug endpoint. Matches against name, description, and category name.
  const items = useMemo(() => {
    const source = data?.menuItems ?? [];

    if (!debouncedSearch) return source;

    const query = debouncedSearch.toLowerCase();

    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query),
    );
  }, [data?.menuItems, debouncedSearch]);

  const originalItems = fullMenuData?.menuItems ?? data?.menuItems ?? [];

  const isInitialLoading =
    (!data && restaurantQuery.isPending) ||
    (Boolean(category) && !fullMenuData && fullMenuQuery.isPending);

  if (isInitialLoading) {
    return <RestaurantMenuPageSkeleton />;
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

  const hasActiveFilters = Array.from(searchParams.values()).some((value) =>
    Boolean(value.trim()),
  );
  const emptyStateVariant = getEmptyStateVariant({
    originalItemCount: originalItems.length,
    selectedCategory: category,
    searchQuery: debouncedSearch,
  });

  /**
   * RES-84: push the customized item into the cart store.
   * The store enforces the one-restaurant-per-cart rule; we only surface
   * the right feedback message for each case.
   */
  const handleAddToCart = (payload: {
    item: PublicMenuItem;
    quantity: number;
    selectedAddons: PublicMenuAddon[];
    removedIngredients: string[];
  }) => {
    const isReplacingCart =
      cartRestaurantId !== null && cartRestaurantId !== data.restaurant._id;

    addItem({
      restaurantId: data.restaurant._id,
      restaurantSlug: data.restaurant.slug,
      restaurantName: data.restaurant.name,
      item: payload.item,
      quantity: payload.quantity,
      selectedAddons: payload.selectedAddons,
      removedIngredients: payload.removedIngredients,
    });

    if (isReplacingCart) {
      toast.info(
        `Your cart was replaced with items from ${data.restaurant.name}. You can order from one restaurant at a time.`,
      );
      return;
    }

    toast.success(`${payload.item.name} added to cart`);
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-restaurant-slug={restaurantSlug}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All restaurants
        </Link>
      </div>

      <main className="mx-auto mb-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <RestaurantBrandingHeader {...data.restaurant} />

        <div className="mt-5">
          <RestaurantOpeningHours
            openingHours={data.restaurant.openingHours}
          />
        </div>

        <div className="mb-5 mt-9 flex items-center gap-3 sm:mt-10">
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
          <p className="text-sm font-medium text-foreground" aria-live="polite">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Select an item to view its details
          </p>
        </div>

        {items.length === 0 ? (
          <MenuEmptyState
            variant={emptyStateVariant}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={
              hasActiveFilters
                ? () => setSearchParams({}, { replace: true })
                : undefined
            }
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
        isRestaurantOpen={data.restaurant.isOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

function getEmptyStateVariant({
  originalItemCount,
  selectedCategory,
  searchQuery,
}: {
  originalItemCount: number;
  selectedCategory: string | null;
  searchQuery: string;
}): MenuEmptyStateVariant {
  if (originalItemCount === 0) return "menu-unpublished";
  if (searchQuery) return "no-results";
  if (selectedCategory) return "empty-category";
  return "no-results";
}
