import type { KeyboardEvent, ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (item: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
  onRowClick?: (item: T) => void;
  getRowLabel?: (item: T) => string;
};

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = "No results found.",
  isLoading = false,
  loadingRows = 5,
  onRowClick,
  getRowLabel,
}: DataTableProps<T>) {
  const handleRowKeyDown = (event: KeyboardEvent, item: T) => {
    if (!onRowClick || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();
    onRowClick(item);
  };

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 border-collapse text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                  <tr key={`loading-${rowIndex}`} aria-hidden="true">
                    {columns.map((column) => (
                      <td key={column.key} className="px-5 py-4">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((item, index) => (
                  <tr
                    key={getRowKey(item)}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={getRowLabel?.(item)}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    onKeyDown={(event) => handleRowKeyDown(event, item)}
                    className={cn(
                      "transition-colors hover:bg-muted/40",
                      onRowClick &&
                        "cursor-pointer focus-visible:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-5 py-4 text-foreground/80",
                          column.cellClassName,
                        )}
                      >
                        {column.render(item, index)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center border-t border-border px-6 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-medium text-foreground">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}
