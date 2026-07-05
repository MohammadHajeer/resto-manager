import { UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";

type MenuEmptyStateProps = {
  isFiltered: boolean;
  onShowAll: () => void;
};

export function MenuEmptyState({ isFiltered, onShowAll }: MenuEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UtensilsCrossed className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
        {isFiltered ? "No items in this category" : "No menu items available"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {isFiltered
          ? "Try another category or return to the full menu."
          : "This restaurant has not added any menu items yet."}
      </p>
      {isFiltered && (
        <Button type="button" className="mt-5" onClick={onShowAll}>
          Show all items
        </Button>
      )}
    </div>
  );
}
