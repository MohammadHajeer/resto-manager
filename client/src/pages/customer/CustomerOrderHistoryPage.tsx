import { ChevronRight, ClockFading, ReceiptText, Store } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { CustomerAccountPageHeader } from "@/components/customer/CustomerAccountPageHeader";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common/Pagination";
import {
  useCustomerCurrentOrders,
  useCustomerOrderHistory,
} from "@/hooks/customer/useCustomerOrders";
import type { CustomerOrder } from "@/services/customer/customer.types";

import { OrderStatusBadge } from "./orders/OrderStatusBadge";
import {
  getOrderRestaurant,
  orderCurrencyFormatter,
  orderDateFormatter,
} from "./orders/orderHelpers";

const HISTORY_PAGE_SIZE = 10;

type HistoryFilter = "all" | "completed" | "cancelled";

const historyFilters: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function parsePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseFilter(value: string | null): HistoryFilter {
  return value === "completed" || value === "cancelled" ? value : "all";
}

function RestaurantLogo({ order }: { order: CustomerOrder }) {
  const restaurant = getOrderRestaurant(order);

  if (restaurant?.logoUrl) {
    return (
      <img
        src={restaurant.logoUrl}
        alt=""
        referrerPolicy="no-referrer"
        className="size-12 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Store className="size-5" aria-hidden="true" />
    </div>
  );
}

function OrderRow({ order }: { order: CustomerOrder }) {
  const restaurant = getOrderRestaurant(order);

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const itemsPreview = order.items
    .map((item) => item.name)
    .join(", ");

  return (
    <li>
      <Link
        to={`/orders/${order._id}`}
        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:p-5"
      >
        <RestaurantLogo order={order} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">
              {restaurant?.name ?? "Restaurant"}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {itemsPreview}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {order.orderCode}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            {orderDateFormatter.format(new Date(order.createdAt))}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              {orderCurrencyFormatter.format(order.totalPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <ChevronRight
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </Link>
    </li>
  );
}

function OrderListSkeleton({ rows }: { rows: number }) {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          className="h-24 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </ul>
  );
}

/**
 * CustomerOrderHistoryPage (RES-99, RES-100, RES-101)
 * ----------------------------------------------------
 * /orders — two sections:
 * - Active orders (pending/accepted/preparing/ready), polled every 30s by
 *   the existing useCustomerCurrentOrders hook so status changes appear
 *   without a manual refresh.
 * - Order history (completed/cancelled) with URL-driven status filter and
 *   pagination, so filters survive refresh and back-navigation.
 */
export default function CustomerOrderHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const filter = parseFilter(searchParams.get("status"));

  const { data: currentOrders, isPending: isLoadingCurrent } =
    useCustomerCurrentOrders();

  const { data: history, isPending: isLoadingHistory } =
    useCustomerOrderHistory({
      page,
      limit: HISTORY_PAGE_SIZE,
      ...(filter !== "all" ? { status: filter } : {}),
    });

  const setFilter = (nextFilter: HistoryFilter) => {
    setSearchParams((params) => {
      if (nextFilter === "all") {
        params.delete("status");
      } else {
        params.set("status", nextFilter);
      }
      params.delete("page");
      return params;
    });
  };

  const setPage = (nextPage: number) => {
    setSearchParams((params) => {
      if (nextPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }
      return params;
    });
  };

  const hasCurrentOrders = Boolean(currentOrders && currentOrders.length > 0);
  const historyOrders = history?.orders ?? [];
  const hasAnyOrders =
    hasCurrentOrders || historyOrders.length > 0 || filter !== "all" || page > 1;

  return (
    <div className="space-y-8">
      <CustomerAccountPageHeader
        title="My Orders"
        description="Track active orders and revisit your order history."
      />

      {/* Active orders */}
      <section aria-label="Active orders">
        <div className="mb-3 flex items-center gap-2">
          <ClockFading className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">
            Active Orders
          </h2>
        </div>

        {isLoadingCurrent ? (
          <OrderListSkeleton rows={1} />
        ) : hasCurrentOrders ? (
          <ul className="space-y-3">
            {currentOrders!.map((order) => (
              <OrderRow key={order._id} order={order} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card px-5 py-6 text-center text-sm text-muted-foreground">
            No active orders right now.
          </p>
        )}
      </section>

      {/* History */}
      <section aria-label="Order history">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              Order History
            </h2>
          </div>

          <div
            className="flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1"
            role="group"
            aria-label="Filter order history by status"
          >
            {historyFilters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoadingHistory ? (
          <OrderListSkeleton rows={3} />
        ) : historyOrders.length > 0 ? (
          <>
            <ul className="space-y-3">
              {historyOrders.map((order) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </ul>

            {history && history.pagination.totalPages > 1 && (
              <div className="mt-5">
                <Pagination
                  pagination={{
                    page: history.pagination.page,
                    limit: history.pagination.limit,
                    total: history.pagination.totalOrders,
                    totalPages: history.pagination.totalPages,
                    hasNextPage: history.pagination.hasNextPage,
                    hasPrevPage: history.pagination.hasPreviousPage,
                  }}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "No past orders yet."
                : `No ${filter} orders.`}
            </p>

            {!hasAnyOrders && (
              <Button
                nativeButton={false}
                className="mt-4 rounded-full px-5"
                render={<Link to="/restaurants" />}
              >
                Browse restaurants
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
