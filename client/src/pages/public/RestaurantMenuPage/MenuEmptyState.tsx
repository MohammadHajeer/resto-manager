import { CookingPot, LayoutGrid, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export type MenuEmptyStateVariant =
  | "menu-unpublished"
  | "empty-category"
  | "no-results";

type MenuEmptyStateProps = {
  variant: MenuEmptyStateVariant;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
};

const emptyStateContent = {
  "menu-unpublished": {
    title: "Menu coming soon",
    description:
      "This restaurant has not published its menu yet. Please check again later.",
    icon: CookingPot,
  },
  "empty-category": {
    title: "Nothing in this category yet",
    description:
      "Try selecting another category to explore the restaurant’s menu.",
    icon: LayoutGrid,
  },
  "no-results": {
    title: "No menu items found",
    description: "Try changing or clearing your current filters.",
    icon: SearchX,
  },
} satisfies Record<
  MenuEmptyStateVariant,
  { title: string; description: string; icon: typeof CookingPot }
>;

export function MenuEmptyState({
  variant,
  hasActiveFilters = false,
  onClearFilters,
}: MenuEmptyStateProps) {
  const { title, description, icon: Icon } = emptyStateContent[variant];

  return (
    <section
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
      aria-labelledby="menu-empty-title"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h2
        id="menu-empty-title"
        className="mt-4 font-heading text-lg font-semibold text-foreground"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {hasActiveFilters && onClearFilters && (
        <Button type="button" className="mt-5" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </section>
  );
}
