import { useMemo, useState } from "react";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { MenuEmptyState } from "./MenuEmptyState";
import { MenuFilters } from "./MenuFilters";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemDetailsSheet } from "./MenuItemDetailsSheet";
import {
  RestaurantBrandingHeader,
  type RestaurantBranding,
} from "./RestaurantBrandingHeader";
import { mockMenuItems, type MockMenuItem } from "./mockMenuData";

const categories = [
  "All",
  ...Array.from(new Set(mockMenuItems.map((item) => item.category))),
];

const restaurantBranding: RestaurantBranding = {
  name: "Green Bowl Bistro",
  slug: "green-bowl-bistro",
  status: "pending",
  description:
    "A modern healthy-food restaurant serving fresh bowls, salads, wraps, and juices.",
  bannerUrl:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  logoUrl:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
  cuisineTypes: ["Healthy", "Salads", "Wraps", "Juices"],
};

export default function RestaurantMenuPage() {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MockMenuItem | null>(null);

  const visibleItems = useMemo(
    () =>
      selectedCategory === "All"
        ? mockMenuItems
        : mockMenuItems.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );

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
        <RestaurantBrandingHeader branding={restaurantBranding} />

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

        <MenuFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mb-5 mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">
            {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Select an item to view its details
          </p>
        </div>

        {visibleItems.length === 0 ? (
          <MenuEmptyState
            isFiltered={selectedCategory !== "All"}
            onShowAll={() => setSelectedCategory("All")}
          />
        ) : (
          <section
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Menu items"
          >
            {visibleItems.map((item) => (
              <MenuItemCard
                key={item.id}
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
      />
    </div>
  );
}
