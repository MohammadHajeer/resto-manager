import { AlertCircle, ArrowRight, Clock3 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { usePendingRestaurants } from "@/hooks/admin/useAdminRestaurants";
import type { PendingRestaurant } from "@/services/admin.service";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : dateFormatter.format(date);
}

export default function AdminApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInteger(searchParams.get("page"), 1);
  const limit = parsePositiveInteger(searchParams.get("limit"), 5);
  const { data, isLoading, isError, isFetching, refetch } =
    usePendingRestaurants(page, limit);

  const pendingRestaurants = data?.restaurants ?? [];
  const pagination = data?.pagination;

  const columns: DataTableColumn<PendingRestaurant>[] = [
    {
      key: "index",
      header: "#",
      render: (_restaurant, index) => (page - 1) * limit + index + 1,
      cellClassName: "w-16 text-muted-foreground",
    },
    {
      key: "restaurant",
      header: "Restaurant",
      render: (restaurant) => (
        <span className="font-medium text-foreground">{restaurant.name}</span>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (restaurant) => restaurant.owner?.name ?? "Unknown owner",
    },
    {
      key: "email",
      header: "Email",
      render: (restaurant) => restaurant.owner?.email ?? "Not provided",
      cellClassName: "text-muted-foreground",
    },
    {
      key: "submitted",
      header: "Submitted",
      render: (restaurant) => formatDate(restaurant.createdAt),
      cellClassName: "whitespace-nowrap text-muted-foreground",
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      ),
    },
    {
      key: "action",
      header: <span className="sr-only">Action</span>,
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (restaurant) => (
        <Link to={`${restaurant._id}`}>
          <Button type="button" size="xs" className="rounded-md">
            Review
            <ArrowRight aria-hidden="true" />
          </Button>
        </Link>
      ),
    },
  ];

  const handlePageChange = (nextPage: number) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("page", String(nextPage));
      nextParams.set("limit", String(limit));
      return nextParams;
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Pending approvals
          </h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Review new restaurant registrations before they join the platform.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
            <Clock3 className="size-4" aria-hidden="true" />
            {pagination?.total ?? pendingRestaurants.length} pending
          </div>
        )}
      </header>

      {isError ? (
        <section className="rounded-md border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <AlertCircle
            className="mx-auto size-8 text-destructive"
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Failed to load pending restaurants
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try loading the approvals again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="mt-5 rounded-md"
          >
            Try again
          </Button>
        </section>
      ) : (
        <>
          <DataTable
            data={pendingRestaurants}
            columns={columns}
            getRowKey={(restaurant) => restaurant._id}
            emptyMessage="There are no pending restaurant registrations right now."
            isLoading={isLoading}
          />

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              disabled={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
}
