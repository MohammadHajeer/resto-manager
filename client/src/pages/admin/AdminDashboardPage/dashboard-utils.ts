import type { AdminOrderStatus } from "@/services/admin/admin.types";
import { createElement } from "react";
import { orderStatusConfig } from "@/components/owner/dashboard/dashboard-utils";
import { restaurantStatusConfig } from "@/config/restaurant-status";

export { orderStatusConfig };
export { restaurantStatusConfig };

export const formatCount = (value: number) =>
  new Intl.NumberFormat("en").format(value);

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const formatChartDate = (value: string, period: 7 | 30) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...(period === 7 ? { weekday: "short" as const } : {}),
  }).format(new Date(`${value}T00:00:00Z`));

export function OrderStatusBadge({ status }: { status: AdminOrderStatus }) {
  const config = orderStatusConfig[status];
  return createElement(
    "span",
    {
      className: `inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`,
    },
    config.label,
  );
}
