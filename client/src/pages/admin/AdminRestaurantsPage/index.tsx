import React from "react";
import { AlertCircle, ArrowRight, Clock3, RefreshCw, Store, Users, CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import { adminService, type PendingRestaurant } from "@/services/admin.service";
import { RestaurantStatusFilters } from "./RestaurantStatusFilters";
import RestaurantStatusBadge from "./RestaurantStatusBadge";

// ── helpers ────────────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "short", day: "numeric",
});

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function relativeLabel(iso: string): { text: string; cls: string } {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return { text: "Today",     cls: "text-primary font-medium" };
  if (days === 1) return { text: "Yesterday", cls: "text-muted-foreground" };
  return            { text: `${days} days ago`, cls: "text-destructive font-medium" };
}

// ── stat card ──────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className={`mt-2 text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

// ── component ──────────────────────────────────────────────────────────────

export default function AdminRestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page   = parsePositiveInteger(searchParams.get("page"),  1);
  const limit  = parsePositiveInteger(searchParams.get("limit"), 10);
  const status = searchParams.get("status") || undefined;

  // Main list query — uses the current status filter
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: queryKeys.admin.restaurants.list({ page, limit, status }),
    queryFn:  () => adminService.getAdminRestaurants({ page, limit, status }),
    placeholderData: keepPreviousData,
  });

  // Separate query just for the pending count badge (always fetch, ignores status filter)
  const { data: pendingData } = useQuery({
    queryKey: queryKeys.admin.restaurants.list({ page: 1, limit: 1, status: "pending" }),
    queryFn:  () => adminService.getAdminRestaurants({ page: 1, limit: 1, status: "pending" }),
    staleTime: 60_000,
  });

  const restaurants  = data?.restaurants ?? [];
  const pagination   = data?.pagination;
  const pendingCount = pendingData?.pagination?.total ?? 0;
  const totalCount   = pagination?.total ?? 0;

  // ── columns ──────────────────────────────────────────────────────────────

  const columns: DataTableColumn<PendingRestaurant>[] = [
    {
      key: "index",
      header: "#",
      render: (_r, idx) => (page - 1) * limit + idx + 1,
      cellClassName: "w-12 text-muted-foreground",
    },
    {
      key: "restaurant",
      header: "Restaurant Name",
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
            {r.name[0]?.toUpperCase() ?? "R"}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate max-w-52">{r.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner Name",
      render: (r) => (
        <div>
          <p className="font-medium text-foreground">{r.owner?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{r.owner?.email ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "submitted",
      header: "Submitted Date",
      render: (r) => {
        const rel = relativeLabel(r.createdAt);
        return (
          <div>
            <p className="text-foreground">{formatDate(r.createdAt)}</p>
            <p className={`text-xs ${rel.cls}`}>{rel.text}</p>
          </div>
        );
      },
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <RestaurantStatusBadge status={r.status} />,
    },
    {
      key: "action",
      header: <span className="sr-only">Action</span>,
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (r) => (
        <Link to={r._id}>
          <Button type="button" size="xs" className="rounded-md">
            Review <ArrowRight aria-hidden="true" />
          </Button>
        </Link>
      ),
    },
  ];

  const handlePageChange = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page",  String(nextPage));
      next.set("limit", String(limit));
      return next;
    });
  };

  const statusLabel =
    !status || status === "all" ? "total restaurants" : `${status} restaurants`;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Restaurant Applications
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review, approve, reject, and monitor restaurant registration
            requests before they become active on the platform.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Clock3 className="size-4" aria-hidden="true" />
            <span>{totalCount} {statusLabel}</span>
          </div>
        )}
      </header>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Clock3}
          label="Pending Reviews"
          value={isLoading ? "—" : pendingCount}
          highlight
        />
        <StatCard
          icon={Store}
          label="Total Restaurants"
          value={isLoading ? "—" : totalCount}
        />
        <StatCard
          icon={CheckCircle}
          label="Avg. Response Time"
          value="4.2 hrs"
        />
        <StatCard
          icon={Users}
          label="Submission Volume"
          value="+15%"
        />
      </div>

      {/* ── ERROR ── */}
      {isError && (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <AlertCircle className="mx-auto size-8 text-destructive" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Failed to load restaurants
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="mt-5 rounded-md"
          >
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        </section>
      )}

      {/* ── TABLE CARD ── */}
      {!isError && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

          {/* Filters inside card */}
          <div className="border-b border-border px-5 py-3">
            <RestaurantStatusFilters />
          </div>

          <div className="px-5 py-5 space-y-5">
            <DataTable
              data={restaurants}
              columns={columns}
              getRowKey={(r) => r._id}
              emptyMessage="No restaurants found matching the current filter."
              isLoading={isLoading}
            />

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              disabled={isFetching}
            />
          </div>
        </div>
      )}
    </div>
  );
}
