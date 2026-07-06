type MenuFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export function MenuFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: MenuFiltersProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Menu categories">
      <div className="flex min-w-max gap-2">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
