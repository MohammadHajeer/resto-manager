import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  showTotal?: boolean;
};

export function Pagination({
  pagination,
  onPageChange,
  disabled = false,
  showTotal = true,
}: PaginationProps) {
  // Guard: data may still be loading when keepPreviousData returns undefined
  if (!pagination) return null;

  const totalPages = Math.max(pagination.totalPages, 1);

  return (
    <nav
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <div className="text-sm text-muted-foreground">
        {showTotal && (
          <span>
            {pagination.total} {pagination.total === 1 ? "item" : "items"}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
          </span>
        )}
        Page{" "}
        <span className="font-medium text-foreground">{pagination.page}</span>{" "}
        of <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
          aria-label="Go to previous page"
          className="rounded-md"
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
          aria-label="Go to next page"
          className="rounded-md"
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
