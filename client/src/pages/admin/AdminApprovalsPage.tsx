import { AlertCircle, ArrowRight, Clock3, RefreshCw, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import { adminService, type PendingRestaurant } from "@/services/admin.service";
import RestaurantStatusBadge from "./AdminRestaurantsPage/RestaurantStatusBadge";

// ── helpers ────────────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "short", day: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function relativeLabel(iso: string): { text: string; cls: string } {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return { text: "Today",     cls: "text-primary font-medium" };
  if (days === 1) return { text: "Yesterday", cls: "text-muted-foreground" };
  return            { text: `${days}d ago`,   cls: "text-destructive font-medium" };
}

function parsePositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// ── stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, highlight = false }: {
  label: string; value: string | number; highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-5 py-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

// ── component ──────────────────────────────────────────────────────────────

export default function AdminApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page  = parsePositiveInt(searchParams.get("page"),  1);
  const limit = parsePositiveInt(searchParams.get("limit"), 10);

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: queryKeys.admin.restaurants.list({ page, limit, status: "pending" }),
    queryFn: () => adminService.getAdminRestaurants({ page, limit, status: "pending" }),
    placeholderData: keepPreviousData,
  });

  const restaurants = data?.restaurants ?? [];
  const pagination  = data?.pagination;

  const columns: DataTableColumn<PendingRestaurant>[] = [
    {
      key: "restaurant",
      header: "Restaurant Name",
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
            {r.name[0]?.toUpperCase() ?? "R"}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate max-w-48">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.owner?.email ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (r) => (
        <div>
          <p className="font-medium text-foreground">{r.owner?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{r.owner?.email ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
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
        <Link to={`/admin/restaurants/${r._id}`}>
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

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Restaurant Approvals
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review and manage pending merchant submissions to the RestoManager network.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Clock3 className="size-4" aria-hidden="true" />
            <span>{pagination?.total ?? restaurants.length} pending</span>
          </div>
        )}
      </header>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Reviews"    value={isLoading ? "—" : (pagination?.total ?? 0)} highlight />
        <StatCard label="Avg. Response Time" value="4.2 hrs" />
        <StatCard label="Page"               value={`${page} / ${pagination?.totalPages ?? 1}`} />
        <StatCard label="Per Page"           value={limit} />
      </div>

      {/* ── ERROR STATE ── */}
      {isError && (
        <section className="rounded-md border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <AlertCircle className="mx-auto size-8 text-destructive" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Failed to load pending restaurants
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button type="button" variant="outline" onClick={() => refetch()} className="mt-5 rounded-md">
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        </section>
      )}

      {/* ── TABLE ── */}
      {!isError && (
        <>
          <DataTable
            data={restaurants}
            columns={columns}
            getRowKey={(r) => r._id}
            emptyMessage="No pending restaurant registrations right now."
            isLoading={isLoading}
            loadingRows={5}
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

      {/* ── EMPTY ICON when all caught up ── */}
      {!isLoading && !isError && restaurants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ShieldCheck className="size-10 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-semibold text-foreground">All caught up!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No pending registrations at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
