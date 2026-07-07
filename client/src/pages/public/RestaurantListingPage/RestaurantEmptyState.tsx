import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

type RestaurantEmptyStateProps = {
  onReset: () => void;
  refetch: () => void;
};

export function RestaurantEmptyState({
  onReset,
  refetch,
}: RestaurantEmptyStateProps) {
  return (
    <section className="rounded-md border border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        No restaurants found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try another search term or clear your current cuisine, price, and
        availability filters.
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-5 rounded-full"
        onClick={onReset}
      >
        Reset filters
      </Button>
      <Button
        type="button"
        variant="outline"
        className="mt-5 rounded-full"
        onClick={refetch}
      >
        Refresh
      </Button>
    </section>
  );
}
