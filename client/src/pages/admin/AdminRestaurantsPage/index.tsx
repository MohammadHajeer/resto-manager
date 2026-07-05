import { AlertCircle, ArrowRight, Clock3 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { useAdminRestaurants } from "@/hooks/admin/useAdminRestaurants";
import type { PendingRestaurant } from "@/services/admin.service";
import { RestaurantStatusFilters } from "./RestaurantStatusFilters";
import RestaurantStatusBadge from "./RestaurantStatusBadge";

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

export default function AdminRestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInteger(searchParams.get("page"), 1);
  const limit = parsePositiveInteger(searchParams.get("limit"), 5);
  const status = searchParams.get("status") || undefined;
  const { data, isLoading, isError, isFetching, refetch } = useAdminRestaurants(
    page,
    limit,
    status,
  );

  const restaurants = data?.restaurants ?? [];
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
      render: (restaurant) => (
        <RestaurantStatusBadge status={restaurant.status} />
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

  const statusLabel =
    (status === "all" || status === undefined) ? "restaurants" : `${status} restaurants`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Restaurant applications
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review, approve, reject, and monitor restaurant registration
            requests before they become active on the platform.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Clock3 className="size-4" aria-hidden="true" />
            <span>
              {pagination?.total ?? restaurants.length} {statusLabel}
            </span>
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
          <RestaurantStatusFilters />
          <DataTable
            data={restaurants}
            columns={columns}
            getRowKey={(restaurant) => restaurant._id}
            emptyMessage="No restaurants found"
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
