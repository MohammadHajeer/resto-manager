import type { PublicRestaurantCategory } from "@/services/public/public.types";
import { useSearchParams } from "react-router-dom";

type MenuFiltersProps = {
  categories: PublicRestaurantCategory[];
};

const CATEGORY_PARAM = "category";

export function MenuFilters({ categories }: MenuFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategorySlug = searchParams.get(CATEGORY_PARAM);

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);

    if (categorySlug === "all") {
      params.delete(CATEGORY_PARAM);
    } else {
      params.set(CATEGORY_PARAM, categorySlug);
    }

    setSearchParams(params, { replace: true });
  };

  const isAllSelected = !selectedCategorySlug;

  return (
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
  );
}
