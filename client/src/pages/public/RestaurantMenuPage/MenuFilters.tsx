import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import type { PublicRestaurantCategory } from "@/services/public/public.types";

type MenuFiltersProps = {
  categories: PublicRestaurantCategory[];
};

const CATEGORY_PARAM = "category";
const SEARCH_PARAM = "search";

/**
 * MenuFilters (RES-73, RES-74, RES-75)
 * -------------------------------------
 * Category pills + a text search input for filtering menu items.
 * Both filters are URL-driven (searchParams), so they survive refresh
 * and back-navigation. The search input is intentionally uncontrolled
 * from the URL on every keystroke — the parent debounces the URL value
 * via `useDebounce` before filtering, keeping typing smooth.
 */
export function MenuFilters({ categories }: MenuFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategorySlug = searchParams.get(CATEGORY_PARAM);
  const currentSearch = searchParams.get(SEARCH_PARAM) ?? "";

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);

    if (categorySlug === "all") {
      params.delete(CATEGORY_PARAM);
    } else {
      params.set(CATEGORY_PARAM, categorySlug);
    }

    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set(SEARCH_PARAM, value);
    } else {
      params.delete(SEARCH_PARAM);
    }

    setSearchParams(params, { replace: true });
  };

  const isAllSelected = !selectedCategorySlug;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={currentSearch}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search menu items..."
          aria-label="Search menu items"
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
        />
        {currentSearch && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div
        className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        aria-label="Menu categories"
      >
        <div className="flex min-w-max gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            aria-pressed={isAllSelected}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
              isAllSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground"
            }`}
          >
            All
          </button>

          {categories.map((category) => {
            const isSelected = category.slug === selectedCategorySlug;

            return (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategoryChange(category.slug)}
                aria-pressed={isSelected}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
